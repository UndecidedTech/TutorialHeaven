const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const JWT = require("jsonwebtoken");
const User = require("../models/user");
const { ObjectId } = require("mongodb");

function getStandardDeviation (array) {
    const n = array.length
    const mean = array.reduce((a, b) => a + b) / n
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

router.get("/", async (req, res) => {
    try {
        const courseID = req.query.courseID;
        const userID = JWT.decode(req.cookies.token).sub

        let selectedCourse = await Course.findById(courseID, (course) => {
            if (course){
                return course.toObject()
            }
        })

        let selectedUser = await User.findById(userID, (err, user) => {
            if (user){
                return user.toObject()
            }
        });

        let userRole;
        selectedUser.courses.forEach((course) => {
            if (course._id.equals(courseID)) {
                userRole = course.role;
            }
        })
        console.log("user role: ", userRole)

        if (userRole === "instructor") {
            let assessments = [];
            let assessmentIds = [];

            selectedCourse.sections.forEach((section) => {
                section.modules.forEach((module) => {
                    if (module.type === "assessment") {
                        let assessmentObj = {
                            "_id": module._id,
                            "name": module.name,
                            "section": section.name,
                            "results": []
                        }
                        assessments.push(assessmentObj)
                        assessmentIds.push(module._id)
                    }
                })
            })

            let table = [["Name", "Section", "Avg Score", "Rating" ]];

            // students array to work with
            const Students = await User.find({ "courses": { $elemMatch: { "_id": courseID, "role": "student" }}}, "", { lean: true })

            // LEARNED SOMETHING NEW, THE _id HAS A "toString" method on it and a "equals" method
            let scores = [];
            let subjects = {};

            await Students.forEach((student) => {
                student.courses.forEach((course) => {
                    if (course._id.equals(courseID)) {
                      scores.push(course.grades[course.grades.length - 1].score)
                      course.results.forEach((result) => {
                          assessments.find((assessment) => {
                            if (assessment._id.equals(result._id)) {
                                // loop through keys in result
                                for (key in result.subjects) {
                                    // check key isn't already in subjects
                                    if (!(key in subjects)) {
                                        subjects[key] = [0,0]
                                    }
                                    // TODO this will break until the quizzes have subjects
                                    subjects[key][0] += result[key][0];
                                    subjects[key][1] += result[key][1];
                                }
                                assessment.results.push(result.score)
                            }
                          })
                      })
                    }
                })
            })

            console.log("Subjects(?): ", subjects);
            assessments.forEach((assessment) => {
                let sum = assessment.results.reduce((a, b) => a + b, 0)
                let avg = (sum / assessment.results.length) || 0

                assessment["avgScore"] = avg

                let stdDev = getStandardDeviation(assessment.results)
                
                assessment["rating"] = ratingCalc(avg, stdDev)

                table.push([assessment.name, assessment.section, assessment.avgScore, assessment.rating])
            })
            return res.send({"assessments": table, "studentsCount": Students.length, "grades": sortGrades(scores)});
        } else {
            let selectedStudent = await Users.findOne({"courses": { $elemMatch: { "_id": courseID, "role": "student" }}})
            let currentGrade = selectedStudent.courses.forEach((course) => {
                if (course._id.equals(courseID)) {
                    course.grades[course.grades.length - 1].score
                }
            })

            res.send({currentGrade})
        }
    } catch (e) {
        console.error(e)
    }
})

function ratingCalc(avg, stdDev) {
    if (avg < 60) {
        return "Poor"
    } else if (avg >= 60 && avg < 70) {
        if (stdDev >= 15) {
            return "Poor"
        } else {
            return "Poor"
        }
    } else if (avg >= 70 && avg < 80) {
        if (stdDev >= 15) {
            return "Fair"
        } else {
            return "Good"
        }
    } else if (avg >= 80 && avg < 90) {
        if (stdDev >= 10) {
            return "Fair"
        } else {
            return "Good"
        }
    } else if (avg >= 90 && avg <= 100) {
        if (stdDev >= 10) {
            return "Fair"
        } else {
            return "Too Easy"
        }
    }
}

function sortGrades(array) {
    let gradesArray = [0, 0, 0, 0, 0];
    for (let i = 0; i < array.length; i++) {
        if (array[i] >=  90) {
            gradesArray[0]++
        } else if (array[i] >= 80 && array[i] < 90) {
            gradesArray[1]++
        } else if (array[i] >= 70 && array[i] < 80) {
            gradesArray[2]++
        } else if (array[i] >= 60 && array[i] < 70) {
            gradesArray[3]++
        } else if (array[i] < 60) {
            gradesArray[4]++
        }
    }

    return gradesArray
}

module.exports = router;