const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const JWT = require("jsonwebtoken");
const User = require("../models/user");
const { ObjectId } = require("mongodb");
const moment = require("moment");

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

            let quizTable = [["Name", "Section", "Avg Score", "Rating" ]];

            // students array to work with
            const Students = await User.find({ "courses": { $elemMatch: { "_id": courseID, "role": "student" }}}, "", { lean: true })

            // LEARNED SOMETHING NEW, THE _id HAS A "toString" method on it and a "equals" method
            let scores = [];
            let subjects = {};

            selectedCourse.subjects.forEach((subject) => {
                subjects[subject] = [0,0]
            })

            console.log(subjects);

            await Students.forEach((student) => {
                student.courses.forEach((course) => {
                    if (course._id.equals(courseID)) {
                      scores.push(course.grades[course.grades.length - 1].score)
                      course.results.forEach((result) => {
                          assessments.find((assessment) => {
                            if (assessment._id.equals(result._id)) {
                                // loop through keys in result
                                for (key in result.subjects) {
                                    // TODO this will break until the quizzes have subjects
                                    subjects[key][0] += result.subjects[key][0];
                                    subjects[key][1] += result.subjects[key][1];
                                }
                                assessment.results.push(result.score)
                            }
                          })
                      })
                    }
                })
            })

            let subjectsTable = [["Subject", "Appearance Rate", "Performance", "Rating"]]
            

            //calculate number of subject questions
            let questionSum = 0;

            for (key in subjects) {
                questionSum += subjects[key][1]
            }

            console.log("number of questions: ", questionSum);


            //build subjects table
            for (key in subjects) {
                subjectsTable.push([key, `${Math.ceil(subjects[key][0] / questionSum) * 100}%`, `${performanceCalc(Math.ceil(subjects[key][0] / subjects[key][1]) * 100)}`, subjectRating((Math.ceil(subjects[key][0] / subjects[key][1]) * 100))])
            }


            console.log("Subjects(?): ", subjects);
            assessments.forEach((assessment) => {
                let sum = assessment.results.reduce((a, b) => a + b, 0)
                let avg = (sum / assessment.results.length) || 0

                assessment["avgScore"] = avg

                let stdDev = getStandardDeviation(assessment.results)
                
                assessment["rating"] = ratingCalc(avg, stdDev)

                quizTable.push([assessment.name, assessment.section, assessment.avgScore, assessment.rating])
            })
            return res.send({"assessments": quizTable, "studentsCount": Students.length, "grades": sortGrades(scores), "subjects": subjectsTable});
        } else {
            let selectedStudent = await User.findOne({"courses": { $elemMatch: { "_id": courseID, "role": "student" }}})
            
            let selectedCourse = await Course.findById(courseID, (course) => {
                if (course){
                    return course.toObject()
                }
            })
            
            // get current grade
            let currentGrade;
            await selectedStudent.courses.forEach((course) => {
                if (course._id.equals(courseID)) {
                    if (course.grades.length > 0)
                        currentGrade = course.grades[course.grades.length - 1].score
                    else
                        currentGrade = "N/A"
                }
            })

            // Grade Growth Chart
            let gradeHistory = [[], []]
            await selectedStudent.courses.forEach((course) => {
                if (course._id.equals(courseID)) {
                    let maxLength = course.grades.length < 6 ? course.grades.length : 6; 
                    for (let i = 1; i <= maxLength; i++) {
                        // dont run first time through
                        if (i > 1) {
                            // filter duplicate score 
                            if (sameDay(course.grades[course.grades.length - (i - 1)].timestamp, course.grades[course.grades.length - i].timestamp)) {
                                gradeHistory[0].pop()
                                gradeHistory[1].pop()
                            }
                        }

                        // fix timestamp formatting
                        let formatTime = `${moment(course.grades[course.grades.length - i].timestamp).format("l")}`
                        gradeHistory[0].push(formatTime);
                        
                        //scores
                        gradeHistory[1].push(course.grades[course.grades.length - i].score)
                    }
                }
            })

            //reverse scores
            gradeHistory[0] = gradeHistory[0].reverse();
            gradeHistory[1] = gradeHistory[1].reverse();

            // subject performance
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

            let quizTable = [["Name", "Section", "Avg Score", "Rating" ]];

            let scores = []
            let subjects = {};

            selectedCourse.subjects.forEach((subject) => {
                subjects[subject] = [0,0]
            })

            console.log("subjects: ", subjects)

            selectedStudent.courses.forEach((course) => {
                if (course._id.equals(courseID)) {
                  scores.push(course.grades[course.grades.length - 1].score)
                  course.results.forEach((result) => {
                      assessments.forEach((assessment) => {
                        if (assessment._id.equals(result._id)) {
                            // loop through keys in result
                            for (key in result.subjects) {
                                // TODO this will break until the quizzes have subjects
                                subjects[key][0] += result.subjects[key][0];
                                subjects[key][1] += result.subjects[key][1];
                            }
                            assessment.results.push(result.score)
                        }
                      })
                  })
                }
            })

            assessments.forEach((assessment) => {
                console.log(assessment);
                // assessment["avgScore"] = avg

                // let stdDev = getStandardDeviation(assessment.results)
                
                // assessment["rating"] = ratingCalc(avg, stdDev)

                quizTable.push([assessment.name, assessment.section, assessment.results, assessment.rating])
            })

            console.log(currentGrade, gradeHistory, quizTable, subjects)

            res.send({currentGrade, gradeHistory, quizTable })
        }
    } catch (e) {
        console.error(e)
    }
})

function sameDay(d1, d2) {
    if (d1 !== undefined) {
        return d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate();
    } else {
        return true
    }
  }

function performanceCalc(value) {
    if (isNaN(value))
        return "0%"
    else
        return `${value}%`
}

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
            return "Good"
        }
    }
}

function subjectRating(ratio) {
    console.log(ratio)
    if (isNaN(ratio))
        return "Poor"
    if (ratio >= 70) {
        return "Good"
    } else if (ratio >= 50 && ratio < 70) {
        return "Fair"
    } else if (ratio < 50) {
        return "Poor"
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