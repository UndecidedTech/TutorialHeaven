const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const JWT = require("jsonwebtoken");
const User = require("../models/user");
const { ObjectId } = require("mongodb");


router.get("/:courseID/", () => {
    let courseID = req.query.courseID;
    let assessmentID = req.query.assessmentID;

    // let selectedAssessment = 
    res.send("success");
})


module.exports = router;