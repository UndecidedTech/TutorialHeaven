const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const JWT = require("jsonwebtoken");
const User = require("../models/user");
const { ObjectId } = require("mongodb");
const multiparty = require("multiparty");
const Forum = require("../models/forum")



const upload = require("../services/uploadImage");
const singleUpload = upload.single('image');

router.get("/", async (req, res) => {
    let courseID = req.query.courseID

    let selectedForum = await Forum.findOne({"courseId": courseID}, (err, forum) => {
        if (forum){
            console.log("Forum: ", forum)
            return forum.toObject()
        } else {
            return forum
        }
    })
    if (!selectedForum) {
        return res.status(404).send("Resource not found/doesn't exist")
    }

    res.send(selectedForum.threads)
})


router.post("/", async (req, res) => {
    singleUpload(req, res, async (err) => {
        if (err) {
            return res.status(422).send({ errors: [{title: 'Image Upload Error', detail: err.message }] })
        }
        let userID = JWT.decode(req.cookies.token).sub
        let courseId = req.body.courseID

        let threadData = {
            "image": req.file.location,
            "title": req.body.title,
            "text": req.body.text,
            "created_by": userID
        }

        let threadUpdate = await Forum.findOneAndUpdate({ "courseId": courseId }, {$push: {"threads": threadData }})

        res.send(threadUpdate.toObject())
    })
})

module.exports = router;