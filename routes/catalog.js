const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const JWT = require("jsonwebtoken");
const User = require("../models/user");
const Notification = require("../models/notification");
const { ObjectId } = require("mongodb");



/** 
* @api {get} /catalog Get Courses List
* @apiName getCourses
* @apiGroup Catalog
*
* @apiParam {String} query String used for partial match regex search on Course names.
*/

// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword



router.get("/", async (req, res) => {

  let userID = JWT.decode(req.cookies.token).sub
  let searchQuery = req.query
  let search = {}

  if  (searchQuery.query && searchQuery.query !== '') {
      const regex = new RegExp(escapeRegex(searchQuery.query), "gi"); 
      search.name = regex
  }

  if (searchQuery.subscribe == 'true') {
    search.subscription = true 
  }

  if (searchQuery.enrolled == 'true') {
      search.students = userID
      search.instructors = userID
  }

  if (searchQuery.query || searchQuery.subscribe == 'true' || searchQuery.enrolled == 'true') {
      console.log("search: ", search)
      await Course.find(search, (err, courses) => {
          if (err) {
              console.error(err)
          } else {
              res.send(courses)
          }
      })
  } else {
    let courseList = await Course.find()
    res.send(courseList)
  }
})

/** 
* @api {post} /catalog Join Course
* @apiName joinCourse
* @apiGroup Catalog
*
* @apiParam {String} courseID String used to retrieve course based on id
*
*/

router.post("/", async (req, res) => {
     let userID = JWT.decode(req.cookies.token).sub;
     let courseID = req.body.courseID;
     
     let courseSearch = await Course.findById({ "_id": courseID })
     
    //  console.log(updatedCourse)
    
     if (courseSearch.students.includes(userID) || courseSearch.instructors.includes(userID)) {
        res.status(405).send("User is already in the course or the resource is invalid")
     } else {
        let courseData = {
            name: courseSearch.name,
            subject: courseSearch.subject,
            role: "student",
            creator: false,
            _id: courseSearch._id
         }
         console.log(courseData)
         // update user to accept course data
         let updatedUser = await User.findByIdAndUpdate({ "_id": userID }, { $push: { "courses": courseData} }, { new: true })

         let updatedCourse = await Course.findByIdAndUpdate({ "_id": courseID }, { $push : { "students": userID } }, { new: true })

         // members array | should just be the member here
         //  let members = updatedCourse.instructors.concat(updatedCourse.students)
         

         // create notification for user joining course
         let notifData = {
            courseId: courseSearch._id,
            title: `You have joined ${updatedCourse.name}`,
            content: `Start working on ${updatedCourse.name} and looking through the content`,
            avi: updatedCourse.image,
            resource: {
                type: "courses",
                _id: updatedCourse._id
            },
            members: [userID]
         }

         let username = `${updatedUser.firstname} ${updatedUser.lastname}`

         

         let instructorNotif = {
             courseId: courseSearch._id,
             title: `New student, ${username}, has joined ${updatedCourse.name}`,
             content: `Your course, ${updatedCourse.name}, now has ${updatedCourse.students.length} students`,
             avi: updatedCourse.image,
             resource: {
                 type: "courses",
                 _id: updatedCourse._id
             },
             members: updatedCourse.instructors 
         }

         await new Notification(instructorNotif).save()

         await new Notification(notifData).save()
         
         console.log("userUpdate: ", updatedUser)
         res.send("success")
     }
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};



module.exports = router;