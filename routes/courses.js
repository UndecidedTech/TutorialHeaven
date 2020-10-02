const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const JWT = require("jsonwebtoken");


router.post("", async (req, res) => {
    let userId = JWT.decode(req.cookies.token).sub
    let courseData = {
        "course_name": req.body.course_name,
        "created_by": userId,
        "instructors": [userId],
        "subject": [req.body.subject],
        "subscription": req.body.subscription
    }

    let courseObject = await new Course(courseData).save();

    console.log(courseObject);

    res.send(courseObject);
})

module.exports = router;