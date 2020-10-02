const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const JWT = require("jsonwebtoken");
const User = require("../models/user");


router.post("/createCourse", async (req, res) => {
    let userId = JWT.decode(req.cookies.token).sub
    let courseData = {
        "name": req.body.name,
        "created_by": userId,
        "instructors": [userId],
        "subject": [req.body.subject],
        "subscription": req.body.subscription
    }

    let courseObject = await new Course(courseData).save();

    let userCourse = {
        "name": req.body.name,
        "role": "instructor",
        "subject": [req.body.subject],
        "creator": true,
        "_id": courseObject.toObject()._id
    }

    let userUpdate = await User.findOneAndUpdate({"_id": userId}, {$push: {"courses": userCourse }}, {new: true})

    res.send(userUpdate.toObject());
});

//useful helper function for generating MongoDB updates
function generateUpdate(field, value) {
    const update = {"$set": {}}
    if(typeof value !== "undefined"){
        update.$set[field] = value;
    }
    return update;
}


module.exports = router;