const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const JWT = require("jsonwebtoken");
const User = require("../models/user");
const { ObjectId } = require("mongodb");


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
    let assessmentIds = []

    selectedCourse.sections.forEach((section) => {
        section.modules.forEach((module) => {
            if (module.type === "assessment") {
                let assessmentObj = {
                    "_id": module._id,
                    "name": module.name,
                    "description": module.description,
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

    await Students.forEach((student) => {
        student.courses.forEach((course) => {
            if (course._id.equals(courseID)) {
                course.results.forEach((result) => {
                    assessments.find((assessment) => {
                        if (assessment._id.equals(result._id)) {
                            assessment.results.push(result.score)
                        }
                    })
                })
            }
        })
    })

    console.log("Assessments: ", assessments)

    res.send("success");
})


module.exports = router;