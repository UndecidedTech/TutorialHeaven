const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const JWT = require("jsonwebtoken");
const User = require("../models/user");
const Notification = require("../models/notification")
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

            let questionSum = {};
            let numberOfQuestions = 0;

            selectedCourse.subjects.forEach((subject) => {
              questionSum[subject] = [0,0]
            })

            selectedCourse.sections.forEach((section) => {
                section.modules.forEach((module) => {
                    if (module.type === "assessment") {
                      numberOfQuestions += module.content.length;
                      module.content.forEach((question) => {
                        if (question.subject) {
                          questionSum[question.subject][0] += 1;
                        }
                      })

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

            //calculate number of subject questions
            for (let key in questionSum) {
              questionSum[key][1] = numberOfQuestions
            }

            let quizTable = [["Name", "Section", "Avg Score", "Rating" ]];

            // students array to work with
            const Students = await User.find({ "courses": { $elemMatch: { "_id": courseID, "role": "student" }}}, "", { lean: true })

            // LEARNED SOMETHING NEW, THE _id HAS A "toString" method on it and a "equals" method
            let scores = [];
            let subjects = {};

            selectedCourse.subjects.forEach((subject) => {
                subjects[subject] = [0,0]
            })

            await Students.forEach((student) => {
                student.courses.forEach((course) => {
                    if (course._id.equals(courseID)) {
                      if (course.grades && course.grades.length > 0) {
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
                    }
                })
            })

            let subjectsTable = [["Subject", "Appearance Rate", "Performance", "Rating"]]
            


            //build subjects table
            for (key in subjects) {
                subjectsTable.push([key, `${appearanceCalc(questionSum[key][0], questionSum[key][1])}`, `${performanceCalc(subjects[key][0], subjects[key][1])}`, subjectRating((Math.ceil(subjects[key][0] / subjects[key][1]) * 100))])
            }

            assessments.forEach((assessment) => {
                let sum = assessment.results.reduce((a, b) => a + b, 0)
                let avg = (sum / assessment.results.length) || 0

                assessment["avgScore"] = avg

                let stdDev = getStandardDeviation(assessment.results)
                
                assessment["rating"] = ratingCalc(avg, stdDev)

                quizTable.push([assessment.name, assessment.section, assessment.avgScore, assessment.rating])
            })

            // build growth chart from notifications
            let startOfYear = moment().startOf("year")
            let joinNotifs = await Notification.find({"courseId": courseID, "title": /^New student,/, timestamp: { $gt: startOfYear } }, "timestamp", { lean: true })

            let userJoin = sortMonth(joinNotifs)

            return res.send({"assessments": quizTable, "studentsCount": Students.length, "grades": sortGrades(scores), "subjects": subjectsTable,  "months": userJoin});
        } else {
            let selectedStudent = await User.findOne({"_id": userID, "courses": { $elemMatch: { "_id": courseID, "role": "student" }}})

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

            let subjectsTable = [["Subject", "Appearance Rate", "Performance", "Rating"]]

            

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

            selectedStudent.courses.forEach((course) => {
                if (course._id.equals(courseID)) {
                  if  (course.grades.length > 0) {
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
                }
            })

            let questionSum = 0;
            
            for (key in subjects) {
                questionSum += subjects[key][1]
            }

            for (key in subjects) {
                subjectsTable.push([key, `${appearanceCalc(subjects[key][0], questionSum)}`, `${performanceCalc(subjects[key][0], subjects[key][1])}`, subjectRating((Math.ceil(subjects[key][0] / subjects[key][1]) * 100))])
            }

            assessments.forEach((assessment) => {
                // assessment["avgScore"] = avg

                // let stdDev = getStandardDeviation(assessment.results)
                
                assessment["rating"] = ratingCalc(assessment.results[0])

                quizTable.push([assessment.name, assessment.section, assessment.results[0], assessment.rating])
            })

            res.send({ currentGrade, gradeHistory, quizTable, subjects: subjectsTable })
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

function performanceCalc(value, total) {
  console.log(value, total)
  if (value > 0) {
    return `${Math.round((value / total) * 100)}%`
  } else {
    return "0%"
  }
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

function sortMonth(array) {

    let currMonth = moment().format("MMMM")

    let monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

    const isMonth = (element) => element === currMonth
    let monthIndex = monthNames.findIndex(isMonth)

    // filter array to return a count for the month or undefined
    let sortedMonths = [[...monthNames],[]]

    let tempArray = []

    array.forEach(notif => {
        let month = moment(notif.timestamp).format("MMMM");
        tempArray.push({ month })
    })

    for (let i = 0; i < monthIndex + 1; i++) {
        // initialize count at 0
        if (i < monthIndex + 1) {
            count = 0
        }
        sortedMonths[1].push(count);

        // iterate for every occurence
        for (let o = 0; o < tempArray.length; o++) {
            if (monthNames[i] === tempArray[o].month) {
                sortedMonths[1][i] += 1
            }
        }
    }

    return sortedMonths
}

function appearanceCalc(value, total) {
    if (value > 0) {
      return `${Math.round((value / total) * 100)}%`
    } else {
      return "0%"
    }
}

module.exports = router;