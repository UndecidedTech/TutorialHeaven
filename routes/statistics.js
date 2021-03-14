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

router.get("/:courseID/", async (req, res) => {
    let courseID = req.params.courseID;

    // console.log(courseID)

    let selectedCourse = await Course.findById(courseID, (course) => {
        if (course){
            return course.toObject()
        }
    })

    // console.log("course: ", selectedCourse)

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

    let scores = []
    // students array to work with
    const Students = await User.find({ "courses._id": courseID }, "", { lean: true })

    // LEARNED SOMETHING NEW, THE _id HAS A "toString" method on it and a "equals" method
    let subjects = {};

    await Students.forEach((student) => {
        student.courses.forEach((course) => {
            if (course._id.equals(courseID)) {
                course.results.forEach((result) => {
                    assessments.find((assessment) => {
                        if (assessment._id.equals(result._id)) {
                            // loop through keys in result
                            for (key in result.subjects) {
                                // check key isn't already in subjects
                                if (!(key in subjects)) {
                                    subjects[key] = [0,0]
                                }
                                subjects[key][0] += results[key][0];
                                subjects[key][1] += results[key][1];
                            }
                            assessment.results.push(result.score)
                        }
                    })
                })
            }
        })
    })

    // results are getting set properly
    console.log("Assessments: ", assessments)

    assessments.forEach((assessment) => {
        let sum = assessment.results.reduce((a, b) => a + b, 0)
        let avg = (sum / assessment.results.length) || 0

        assessment["avgScore"] = avg;

        let stdDev = getStandardDeviation(assessment.results);
        console.log(stdDev);
        
        assessment["rating"] = ratingCalc(avg, stdDev)

        table.push([assessment.name, assessment.section, assessment.avgScore, assessment.rating])
    })

    console.log("After AVG: ", assessments)

    res.send({"assessments": table, "studentsCount": Students.length});
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

module.exports = router;