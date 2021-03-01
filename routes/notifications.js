const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const JWT = require("jsonwebtoken");
const User = require("../models/user");
const { ObjectId } = require("mongodb");
const Notification = require("../models/notification")


router.get("/", async (req, res) => {
    console.log(req.body, req.query)
    let marked = req.query.marked || false
    let userID = JWT.decode(req.cookies.token).sub

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

    let readNotifications = selectedUser.read_notifications;
    marked = JSON.parse(marked)

    if (marked) {
        let selectedNotifications = await Notification.find({ "courseId": {$in : courseIds}, "members": userID }, null, {sort: { timestamp: 'desc' }})
        return res.send(selectedNotifications)
    } else {
        let selectedNotifications = await Notification.find({ "courseId": { $in : courseIds }, "_id": { $nin: readNotifications }, "members": userID }, null, {sort: { timestamp: 'desc' }})
        return res.send(selectedNotifications)
    }
})


router.post("/", async (req, res) => {
    console.log(req.body)

    let userID = JWT.decode(req.cookies.token).sub
    let notificationID = req.body._id

    let selectedUser = await User.findById(userID, (err, user) => {
        if (user) {
            return user.toObject()
        } else {
            return user
        }
    })

    let readNotifications = undefined;

    if (selectedUser) {
        readNotifications = selectedUser.read_notifications;
    }

    if (readNotifications.includes(notificationID)) {
        console.log("WERE REMOVING THE NOTIFICATION NOW")
        let update = {$pull: {}};
        update.$pull['read_notifications'] = notificationID
        
        let userUpdate = await User.findByIdAndUpdate(userID, update, { new: true }, (err, user) => {
            if (user) {
                return user.toObject()
            } else {
                return user
            }
        })
        
        res.send(userUpdate)
    } else {
        console.log("WERE ADDING THE NOTIFICATION ahahahahahh :D")
        let update = { $addToSet: {} }
        update.$addToSet['read_notifications'] = notificationID

        let userUpdate = await User.findByIdAndUpdate(userID, update, { new: true }, (err, user) => {
            if (user) {
                return user.toObject()
            } else {
                return user
            }
        })

        res.send(userUpdate)

    }
})

module.exports = router;