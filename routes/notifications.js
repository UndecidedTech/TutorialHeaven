const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const JWT = require("jsonwebtoken");
const User = require("../models/user");
const { ObjectId } = require("mongodb");
const Notification = require("../models/notification")


router.get("/", async (req, res) => {
    console.log(req.body, req.query)
    let userID = req.query.userID
    
    console.log("userID: ", userID)
    let selectedUser = await User.findById(userID, (err, user) => {
        if (user) {
            return user.toObject()
        }
    })

    let courses = selectedUser.courses;

    // courseIds mapping works
    let courseIds = courses.map((course) => {
        return course._id
    })
    
    // console.log(courseIds);

    let selectedNotifications = await Notification.find({ "courseId": {$in : courseIds} })

    

    console.log(selectedNotifications);
    res.send(selectedNotifications)
})

module.exports = router;