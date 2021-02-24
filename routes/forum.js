const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const JWT = require("jsonwebtoken");
const User = require("../models/user");
const { ObjectId } = require("mongodb");
const multiparty = require("multiparty");
const Forum = require("../models/forum")
const Notification = require("../models/notification");




const upload = require("../services/uploadImage");
const singleUpload = upload.single('image');

router.get("/", async (req, res) => {
    let courseID = req.query.courseID

    let selectedForum = await Forum.findOne({"courseId": courseID}, (err, forum) => {
        if (forum){
            // console.log("Forum: ", forum)
            return forum.toObject()
        } else {
            return forum
        }
    })
    if (!selectedForum) {
        return res.status(204).send("Resource not found/doesn't exist")
    }

    res.send(selectedForum)
})


router.post("/", async (req, res) => {
    singleUpload(req, res, async (err) => {
        if (err) {
            return res.status(422).send({ errors: [{title: 'Image Upload Error', detail: err.message }] })
        }
        let userID = JWT.decode(req.cookies.token).sub
        let courseID = req.body.courseID

        let selectedUser = await User.findOne({"_id": userID}, (err, user) => {
            if (err) {
                return res.status(504).send("User is not allowed to use this resource or doesn't exist")
            }
            return user.toObject()
        })
        console.log(selectedUser);
        // console.log("User Return: ", userData)

        

        let userName = selectedUser._doc.firstname + " " + selectedUser._doc.lastname

        let threadData = {
            "image": req.file.location,
            "title": req.body.title,
            "text": req.body.text,
            "created_by": {
                "userId": selectedUser._doc._id,
                "name": userName
            }
        }
        if (req.body.moduleID && req.body.sectionID) {
            console.log("triggered")
            threadData.relation = {sectionId: req.body.sectionID, moduleId: req.body.moduleID}
        }


        let threadUpdate = await Forum.findOneAndUpdate({ "courseId": courseID }, {$push: {"threads": threadData } }, { new: true })

        res.send(threadUpdate.toObject())
    })
})

router.post("/like", async (req, res) => {
    let userID = JWT.decode(req.cookies.token).sub

    let courseID = req.body.courseID;
    let threadID = req.body.threadID;


    
    let threadData = await Forum.findOne({"courseId": courseID, "threads._id": threadID }, "threads.$", (err, forum) => {
        console.log("Yall seeing this shit? ", forum)
        if (forum) {
            return forum.toObject()
        } else {
            return forum
        }
    })

    let thread = undefined;
    if (threadData.threads.length === 1)
        thread = threadData.threads[0]; 
    
    if (thread.likes.includes(userID)) {
        let update = {$pull: {}};
        update.$pull[`threads.$.likes`] = userID;

        let threadUpdate = await Forum.findOneAndUpdate({ "courseId": courseID, "threads._id": threadID }, update, { new: true })
        let selectedForum = await Forum.findOne({"courseId": courseID}, (err, forum) => {
            if (forum){
                // console.log("Forum: ", forum)
                return forum.toObject()
            } else {
                return forum
            }
        })
        res.send(selectedForum)
    } else {
        let update = { $push: {}}
        update.$push[`threads.$.likes`] = userID

        let threadUpdate = await Forum.findOneAndUpdate({ "courseId": courseID, "threads._id": threadID }, update, { new: true })

    // console.log("ThreadUpdate", threadUpdate.toObject())
        let selectedForum = await Forum.findOne({"courseId": courseID}, (err, forum) => {
            if (forum){
            // console.log("Forum: ", forum)
                return forum.toObject()
            } else {
                return forum
            }
        })

        res.send(selectedForum)
    }
    // console.log("HERE: ", threadData);
})

router.post("/post", async (req, res) => {
    let userID = JWT.decode(req.cookies.token).sub

    let courseID = req.body.courseID;
    let threadID = req.body.threadID;

    let selectedUser = await User.findOne({"_id": userID}, (err, user) => {
        if (err) {
            return res.status(504).send("User is not allowed to use this resource or doesn't exist")
        }
        return user.toObject()
    })

    let update = { $push: {}}
    update.$push[`threads.$.posts`] = {
        "created_by": {
            "name": selectedUser._doc.firstname + " " + selectedUser._doc.lastname,
            "userId": selectedUser._doc._id
        },
        "text": req.body.text
    }

    let selectedCourse = await Course.findById(courseID)

    let threadUpdate = await Forum.findOneAndUpdate({ "courseId": courseID, "threads._id": threadID }, update, { new: true })

    let selectedThread = threadUpdate.threads.find(thread => thread._id === ObjectId(threadID))

    let notif = {
        courseId: courseID,
        courseName: selectedCourse.name,
        title: `${selectedUser.firstname + ' ' + selectedUser.lastname } just replied to your thread`,
        content: `Check your thread to see what people are saying`,
        avi: selectedCourse.image,
        resource: {
            type: "forum",
            _id: courseID
        },
        subresource: {
            _id: threadID
        },
        members: [selectedThread.created_by.userId],
        image: selectedThread.image
    }

    await new Notification(notif).save()

    res.send(threadUpdate.toObject())
})

router.delete("/", async (req,res) => {
  console.log(req.body)
  let userID = JWT.decode(req.cookies.token).sub
  let courseID = req.body.courseID
  let threadID = req.body.threadID


  let selectedThread = await Forum.findOne({ "courseId": courseID, "threads._id": threadID }, {"threads.$": 1})

  let selectedCourse = await Course.findOne({"_id": courseID})

  if (selectedCourse.instructors.includes(userID) || selectedThread.threads[0].created_by.userId == userID) {
    let update = {$pull: {}}
    update.$pull["threads"] = {"_id": threadID}

    let threadUpdate = await Forum.findOneAndUpdate({"courseId": req.body.courseID, "threads._id": req.body.threadID}, update, { new: true})
    return res.send(threadUpdate.toObject())      
  } else {
    return res.status(504).send("User does not have the right to delete this thread")
  }
})

router.delete("/post", async (req,res) => {
  let userID = JWT.decode(req.cookies.token).sub
  let courseID = req.body.courseID
  let threadID = req.body.threadID
  let postID = req.body.postID

  let selectedThread = await Forum.findOne({ "courseId": courseID, "threads._id": threadID }, {"threads.$": 1})
  let selectedCourse = await Course.findOne({"_id": courseID})
  

  if (selectedCourse.instructors.includes(userID) || selectedThread.threads[0].created_by.userId == userID) {
    let update = {$pull: {}}
    update.$pull[`threads.$.posts`] = { "_id": postID }

    let threadUpdate = await Forum.findOneAndUpdate({"courseId": courseID, "threads._id": threadID}, update, { new: true })
    return res.send(threadUpdate.toObject())      
  } else {
    return res.status(504).send("User does not have the right to delete this post")
  }

})

module.exports = router;