const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const JWT = require("jsonwebtoken");
const User = require("../models/user");
const { ObjectId } = require("mongodb");


// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword

router.get("/", async (req, res) => {

  if (req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), "gi");
      await Course.find({"name": regex}, (err, courses) => {
          if (err) {
              console.error(err)
          } else {
              res.send(courses)
          }
      })
  } else {
    let courseList = await Course.find({})
    res.send(courseList)
  }
})

router.post("/", async (req, res) => {
     let userID = JWT.decode(req.cookies.token).sub;
     let courseID = req.body.courseID;
     
     let updatedCourse = await Course.findByIdAndUpdate({ "_id": courseID }, { "$push": { "students": userID } }, { new: true })
     
    //  console.log(updatedCourse)
    
     if (updatedCourse.students.includes(userID) || updatedCourse.instructors.includes(userID)) {
        res.status(405).send("User is already in the course or the resource is invalid")
     } else {
        let courseData = {
            name: updatedCourse.name,
            subject: updatedCourse.subject,
            role: "student",
            creator: false,
            _id: updatedCourse._id
         }
         console.log(courseData)
    
         let updatedUser = await User.findByIdAndUpdate({ "_id": userID }, { $push: { "courses": courseData} }, { new: true })
         console.log("userUpdate: ", updatedUser)
         res.send("success")
     }
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};



module.exports = router;