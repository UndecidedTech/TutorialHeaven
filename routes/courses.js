const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const JWT = require("jsonwebtoken");
const User = require("../models/user");
const { ObjectId } = require("mongodb");
const multiparty = require("multiparty");
const Forum = require("../models/forum");

const upload = require("../services/uploadImage");
const singleUpload = upload.single('image');

/** 
* @api {get} /getCourse/:courseID Get CourseID
* @apiName courseID
* @apiGroup Courses
*
* @apiParam {String} query String used for partial match regex search on Course names.
*/

// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword
router.get("/getCourse/:courseID", async (req, res) => {
    let courseID = req.params.courseID;
    let userID = JWT.decode(req.cookies.token).sub
    
    let selectedCourse = await Course.findOne({"_id": courseID }, (err, course) => {
        if (course)
            return course.toObject();
        else
            return course
    })
    if (!selectedCourse) {
        return res.status(404).send("Resource not found/doesn't exist")
    }


    if (selectedCourse.instructors.includes(userID) || selectedCourse.students.includes(userID)){
        res.send(selectedCourse)
    } else {
        res.status(404).send("User does not have access to this resource")
    }

});

/** 
* @api {post} /createCourse Create Course
* @apiName createCourse
* @apiGroup Courses
*
* @apiParam {String} query String used for partial match regex search on Course names.
*/

// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword

router.post("/createCourse", async (req, res) => {
    let userId = JWT.decode(req.cookies.token).sub;

    singleUpload(req, res, async function (err) {
      if (err) {
        return res.status(422).send({ errors: [{ title: 'Image Upload Error', detail: err.message }] });
      }
      let userId = JWT.decode(req.cookies.token).sub;
      
      // console.log("Inside Body:", req.body)
      // console.log("Inside Function: ", req.file);
      // console.log("Inside Coursedata", courseData);
      // save the file's url to a property on the user's db record --> will use that to render their profile picture
      // let update = {"$set": {"avi": req.file.location}};
       let courseData = {
          "image": req.file.location,
          "name": req.body.name,
          "subject": [req.body.subject],
          "subscription": req.body.subscription,
          "description": req.body.description,
          "instructors": [userId],
          "created_by": userId 
        };


        let courseObject = await new Course(courseData).save();

        let forumData = {
            "courseId": courseObject.toObject()._id
        }

        let forumObject = await new Forum(forumData).save()

        let userCourse = {
            "name": req.body.name,
            "role": "instructor",
            "subject": [req.body.subject],
            "creator": true,
            "_id": courseObject.toObject()._id
        }

        let userUpdate = await User.findOneAndUpdate({"_id": userId}, {$push: {"courses": userCourse }}, {new: true})

        res.send(userUpdate.toObject())
    });
    
})

// router.post("/createCourse", async (req, res) => {
//     let userId = JWT.decode(req.cookies.token).sub
//     let courseData = {
//         "name": req.body.name,
//         "created_by": userId,
//         "instructors": [userId],
//         "subject": [req.body.subject],
//         "subscription": req.body.subscription
//     }

//     let courseObject = await new Course(courseData).save();

//     let userCourse = {
//         "name": req.body.name,
//         "role": "instructor",
//         "subject": [req.body.subject],
//         "creator": true,
//         "_id": courseObject.toObject()._id
//     }

//     let userUpdate = await User.findOneAndUpdate({"_id": userId}, {$push: {"courses": userCourse }}, {new: true})

//     res.send(userUpdate.toObject());
// });

/** 
* @api {post} /createSection Create Section
* @apiName createSection
* @apiGroup Courses
*
* @apiParam {String} query String used for partial match regex search on Course names.
*/

// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword

router.post("/createSection", async (req, res) => {
  console.log(req.body)
  let userID = JWT.decode(req.cookies.token).sub;
  let courseID = req.body.courseID
  let newSection = {
    name: req.body.name,
    created_by: userID
  }
  let sectionCreate = await Course.findOneAndUpdate({"_id": courseID}, {$push: {"sections": newSection }}, {new: true})
  res.send(sectionCreate.toObject())
})

/** 
* @api {put} /updateCourse Update Course
* @apiName updateCourse
* @apiGroup Courses
*
* @apiParam {String} query String used for partial match regex search on Course names.
*/

// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword

router.put("/updateCourse", async (req, res) => {
    let courseID = req.body.courseID;
    let userID = JWT.decode(req.cookies.token).sub
    let update = generateUpdate(req.body.field, req.body.value);

    let selectedCourse = await Course.findById(courseID, (err, course) => {
        return course.toObject()
    });

    // content
    if (selectedCourse.instructors.includes(userID)){
      let update = { $set: {}}
      update.$set[`${req.body.field}`] = req.body.value
      let courseUpdate = await Course.findOneAndUpdate({"_id": courseID}, update, {new: true})
      res.send(courseUpdate);
    } else {
        res.status(404).send("User does not have access to this resource")
    }
})

/** 
* @api {put} /updateSection Update Section
* @apiName updateSection
* @apiGroup Courses
*
* @apiParam {String} query String used for partial match regex search on Course names.
*/

// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword

router.put("/updateSection", async (req, res) => {
    let courseID = req.body.courseID;
    let sectionID = req.body.sectionID;
    let userID = JWT.decode(req.cookies.token).sub;
    
    let selectedCourse = await Course.findById(courseID, (err, course) => {
        return course.toObject();
    });

    if (selectedCourse.instructors.includes(userID)){
        let update = { $set: {} }
        update.$set[`sections.$.${req.body.field}`] = req.body.value;
        let courseUpdate = await Course.findOneAndUpdate({ "_id": courseID, "sections._id": sectionID }, update, { new: true })
        res.send(courseUpdate);
        console.log(courseUpdate)
    }
})

/** 
* @api {post} /deleteSection Delete Section
* @apiName deleteSection
* @apiGroup Courses
*
* @apiParam {String} query String used for partial match regex search on Course names.
*/

// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword

router.post("/deleteSection", async (req, res) => {
    let courseID = req.body.courseID;
    let sectionID = req.body.sectionID;

    let userID = JWT.decode(req.cookies.token).sub;

    let selectedCourse = await Course.findById(courseID,(err, course) => {
        return course.toObject()
    });

    if (selectedCourse.instructors.includes(userID)) {
        let update = {$pull: {}}
        update.$pull["sections"] = { "_id": sectionID };
        let sectionUpdate = await Course.findOneAndUpdate({"_id": courseID }, update, { new: true })
        res.send(sectionUpdate)
    }
})

/** 
* @api {post} /createModule Create Module
* @apiName createModule
* @apiGroup Courses
*
* @apiParam {String} query String used for partial match regex search on Course names.
*/

// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword

router.post("/createModule", async (req, res) => {
    let courseID = req.body.courseID;
    let sectionID = req.body.sectionID;
    let userID = JWT.decode(req.cookies.token).sub;

    let selectedCourse = await Course.findById(courseID, (err, course) => {
        return course.toObject()
    });

    let newModule = {
        name: req.body.name,
        description: req.body.description,
        type: req.body.type 
    }
    if (selectedCourse.instructors.includes(userID)) {
        let update = { $push: {} }
        update.$push["sections.$.modules"] = newModule; 
        let moduleUpdate = await Course.findOneAndUpdate({"_id": courseID, "sections._id": sectionID }, update, { new: true })
        console.log(moduleUpdate);
        res.send(moduleUpdate);
    }
})

/** 
* @api {put} /updateModule Update Modeule
* @apiName updateModule
* @apiGroup Courses
*
* @apiParam {String} query String used for partial match regex search on Course names.
*/

// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword

router.put("/updateModule", async (req, res) => {
    let courseID = req.body.courseID;
    let sectionID = req.body.sectionID;
    let moduleID = req.body.moduleID;
    let field = req.body.field;
    let value = req.body.value;
    let userID = JWT.decode(req.cookies.token).sub;
     
    let selectedCourse = await Course.findById(courseID, (err, course) => {
        return course.toObject()
    });

    if (selectedCourse.instructors.includes(userID)){
        let update = { $set: {}}
        update.$set[`sections.$.modules.$[module].${field}`] = value;
        let moduleUpdate = await Course.findOneAndUpdate({ "_id": courseID, "sections._id": sectionID }, update, { new: true, arrayFilters: [{ 'module._id': moduleID}] })
        res.send(moduleUpdate)
        console.log(moduleUpdate)
    }
})

/** 
* @api {post} /deleteModule Delete Modeule
* @apiName deleteModule
* @apiGroup Courses
*
* @apiParam {String} query String used for partial match regex search on Course names.
*/

// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword

router.post("/deleteModule", async (req, res) => {
    let courseID = req.body.courseID;
    let sectionID = req.body.sectionID;
    let moduleID = req.body.moduleID;

    let userID = JWT.decode(req.cookies.token).sub;
    
    let selectedCourse = await Course.findById(courseID, (err, course) => {
        return course.toObject()
    });
    if (selectedCourse.instructors.includes(userID)) {
        let update = {$pull: {}}
        update.$pull["sections.$.modules"] = { "_id": moduleID };
        let moduleUpdate = await Course.findOneAndUpdate({"_id": courseID, "sections._id": sectionID}, update, { new: true })
        res.send(moduleUpdate)
    }
})

/** 
* @api {post} /createModuleContent Create Module Content
* @apiName createModuleContent
* @apiGroup Courses
*
* @apiParam {String} query String used for partial match regex search on Course names.
*/

// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword

router.post("/createModuleContent", async (req, res) => {
    let courseID = req.body.courseID;
    let sectionID = req.body.sectionID;
    let moduleID =  req.body.moduleID
    let type = req.body.type;
    let userID = JWT.decode(req.cookies.token).sub;

    let selectedCourse = await Course.findById(courseID, (err, course) => {
        return course.toObject()
    });

    console.log(req.body)
    console.log(selectedCourse)
    if (selectedCourse.instructors.includes(userID)) {
        let update = {$push: {}}
        update.$push["sections.$.modules.$[module].content"] = { type };
        let moduleUpdate = await Course.findOneAndUpdate({"_id": courseID, "sections._id": sectionID }, update, { new: true, arrayFilters: [{ 'module._id': moduleID}] })
        res.send(moduleUpdate);
    }
})

/** 
* @api {put} /updateModuleContent Update Module Content
* @apiName updateModuleContent
* @apiGroup Courses
*
* @apiParam {String} query String used for partial match regex search on Course names.
*/

// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword

router.put("/updateModuleContent", async (req, res) => {
    let courseID = req.body.courseID;
    let sectionID = req.body.sectionID;
    let contentID = req.body.contentID;
    let moduleID = req.body.moduleID;
    let userID = JWT.decode(req.cookies.token).sub;
    
    let value = req.body.value;

    console.log(req.body);
    let selectedCourse = await Course.findById(courseID, (err, course) => {
        return course.toObject()
    });
    if (selectedCourse.instructors.includes(userID)) {
        let update = {$set: {}}
        update.$set["sections.$.modules.$[module].content.$[content].value"] = value;
        let sectionUpdate = await Course.findOneAndUpdate({"_id": courseID, "sections._id": sectionID }, update, { new: true, arrayFilters: [{ 'module._id': moduleID }, { 'content._id' : contentID }] })
        console.log(sectionUpdate);
        res.send(sectionUpdate);
    }

})

/** 
* @api {post} /createAssessmentContent Create Assessment Content
* @apiName createAssessmentContent
* @apiGroup Courses
*
* @apiParam {String} query String used for partial match regex search on Course names.
*/

// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword

router.post("/createAssessmentContent", async (req, res) => {
    let courseID = req.body.courseID;
    let sectionID = req.body.sectionID;
    let moduleID =  req.body.moduleID
    let type = req.body.type;

    let userID = JWT.decode(req.cookies.token).sub;
    console.log(req.body)
    let selectedCourse = await Course.findById(courseID, (err, course) => {
        return course.toObject()
    });
  
    if (selectedCourse.instructors.includes(userID)) {
        let update = {$push: {}}
        update.$push["sections.$.modules.$[module].content"] = { type };
        let assessmentUpdate = await Course.findOneAndUpdate({"_id": courseID, "sections._id": sectionID }, update, { new: true, arrayFilters: [{ 'module._id': moduleID}] })
        res.send(assessmentUpdate);
    }
})

/** 
* @api {put} /updateAssessmentContent Update Assessment Content
* @apiName updateAssessmentContent
* @apiGroup Courses
*
* @apiParam {String} query String used for partial match regex search on Course names.
*/

// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword

router.put("/updateAssessmentContent", async (req, res) => {
    let courseID = req.body.courseID;
    let sectionID = req.body.sectionID;
    let moduleID = req.body.moduleID;
    

    let userID = JWT.decode(req.cookies.token).sub;

    let value = req.body.value
    console.log("reqbody", req.body.value)

    let selectedCourse = await Course.findById(courseID, (err, course) => {
        return course.toObject()
    });

    if(selectedCourse.instructors.includes(userID)) {
        let update = {$set: {}}
        update.$set["sections.$.modules.$[module].content"] = value;
        let assessmentUpdate = await Course.findOneAndUpdate({"_id": courseID, "sections._id": sectionID }, update, { new: true, arrayFilters: [{ 'module._id': moduleID }] });
        console.log(assessmentUpdate);
        res.send(assessmentUpdate);
    }
})

/** 
* @api {post} /deleteAssessmentContent Delete Assessment Content
* @apiName deleteAssessmentContent
* @apiGroup Courses
*
* @apiParam {String} query String used for partial match regex search on Course names.
*/

// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword

router.post("/deleteAssessmentContent", async (req, res) => {
    let courseID = req.body.courseID;
    let sectionID = req.body.sectionID;
    let contentID = req.body.contentID;
    let moduleID = req.body.moduleID;

    let userID = JWT.decode(req.cookies.token).sub;

    let selectedCourse = await Course.findById(courseID, (err, course) => {
        return course.toObject()
    });
    if (selectedCourse.instructors.includes(userID)) {
        let update = {$pull: {}}
        update.$pull[`sections.$.modules.$[module].content`] = { "_id": contentID };
        let assessmentUpdate = await Course.findOneAndUpdate({"_id": courseID, "sections._id": sectionID}, update, { new: true, arrayFilters: [{ 'module._id': moduleID }] })
        res.send(assessmentUpdate)
    }
})

/** 
* @api {post} /deleteModuleContent Delete Module Content
* @apiName deleteModuleContent
* @apiGroup Courses
*
* @apiParam {String} query String used for partial match regex search on Course names.
*/

// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword

router.post("/deleteModuleContent", async (req, res) => {
    let courseID = req.body.courseID;
    let sectionID = req.body.sectionID;
    let contentID = req.body.contentID;
    let moduleID = req.body.moduleID;

    let userID = JWT.decode(req.cookies.token).sub;

    let selectedCourse = await Course.findById(courseID, (err, course) => {
        return course.toObject()
    });
    if (selectedCourse.instructors.includes(userID)) {
        let update = {$pull: {}}
        update.$pull["sections.$.modules.$[module].content"] = { "_id": contentID };
        let moduleUpdate = await Course.findOneAndUpdate({"_id": courseID, "sections._id": sectionID}, update, { new: true, arrayFilters: [{ 'module._id': moduleID }] })
        res.send(moduleUpdate)
    }
})

router.post("/settings/:courseID", async (req, res) => {
    let courseID = req.params.courseID;
    let userID = JWT.decode(req.cookies.token).sub;
    let updates = req.body

    // query course
    let selectedCourse = await Course.findById(courseID, (err, course) => {
        if (course)
            return course.toObject()
        else
            return course
    })
    // check course exists
    if (selectedCourse === null)
        return res.status(500).send("Course not found")

    // check is an instructor
    if (selectedCourse.instructors.includes(userID)) {
        singleUpload(req, res, async function(err) {
            if (err) {
                return res.status(422).send({ errors: [{ title: 'Image Upload Error', detail: err.message }] });
            }
            let update = { "$set": { "image": req.file.location } };
            let updatedCourse = await Course.findByIdAndUpdate(courseID, update).lean();
            if (updatedCourse) {
                return res.send(updatedCourse);
            } else {
                res.status(404).send("Course not found");
            }
        })
    } else {
        return res.status(404).send("Not authorized to perform this action")
    }
})

router.post("/settings/subjects", async (req, res) => {
    let userID = JWT.decode(req.cookies.token).sub;
    let courseID = req.body.courseID;
    let subject = req.body.subject;

    console.log(req.body);

    let selectedCourse = await Course.findById(courseID, (err, course) => {
        console.log(course);
        return course.toObject()
    });

    // check user is instructor
    if (selectedCourse.instructors.includes(userID)){
        if (selectedCourse.subjects.includes(subject)) {
            let update = {$pull: {}};
            update.$pull["subjects"] = subject;
            let settingsUpdate = await Course.findOneAndUpdate({ "_id": courseID }, update, { new: true })
            console.log(settingsUpdate)
            return res.send(settingsUpdate)
        } else {
            let update = { $addToSet: {}}
            update.$addToSet["subjects"] = subject;
            let settingsUpdate = await Course.findOneAndUpdate({ "_id": courseID }, update, { new: true })
            console.log(settingsUpdate)
            return res.send(settingsUpdate)
        }
    } else {
        return res.status(500).send("User is not permitted to perform this action")
    }
})

router.post("/settings/name", async (req, res) => {
    let userID = JWT.decode(req.cookies.token).sub;
    let courseID = req.body.courseID;
    let name = req.body.name;

    let selectedCourse = await Course.findById(courseID, (err, course) => {
        console.log(course);
        return course.toObject()
    });
    // check user is instructor
    if (selectedCourse.instructors.includes(userID)){
        let update = generateUpdate("name", name)
        let settingsUpdate = await Course.findOneAndUpdate({ "_id": courseID }, update, { new: true })
        return res.send(settingsUpdate)
    } else {
        return res.status(500).send("User is not permitted to perform this action")
    }
})

router.post("/settings/description", async (req, res) => {
    let userID = JWT.decode(req.cookies.token).sub;
    let courseID = req.body.courseID;
    let description = req.body.description;

    let selectedCourse = await Course.findById(courseID, (err, course) => {
        console.log(course);
        return course.toObject()
    });
    // check user is instructor
    if (selectedCourse.instructors.includes(userID)){
        let update = generateUpdate("description", description)
        let settingsUpdate = await Course.findOneAndUpdate({ "_id": courseID }, update, { new: true })
        return res.send(settingsUpdate)
    } else {
        return res.status(500).send("User is not permitted to perform this action")
    }
})

router.post("/settings/students", async (req, res) => {
    let userID = JWT.decode(req.cookies.token).sub;
    let courseID = req.body.courseID;
    let studentID = req.body.studentID;

    let selectedCourse = await Course.findById(courseID, (err, course) => {
        console.log(course);
        return course.toObject()
    });

    if (selectedCourse.instructors.includes(userID)) {
        if (selectedCourse.students.includes(studentID)){
            let update = {$pull: {}};
            update.$pull["students.$"] = studentID;
            let settingsUpdate = await Course.findOneAndUpdate({ "_id": courseID, "students._id": studentID }, update, { new: true })
            let Students = await User.find({"_id": { $in: selectedCourse.students }}, "", {lean: true})
        
            Students = Students.map((student) => {
                return {
                    "name": `${student.firstname} ${student.lastname}`,
                    "_id": student._id
                }
            })
            
            return res.send({ settingsUpdate, Students })
        } else {
            return res.status(500).send("Student doesn't exist in the course")
        }
    } else {
        return res.status(500).send("User is not permitted to perform this action")
    }
})

router.post("/settings/instructors", async (req, res) => {
    let userID = JWT.decode(req.cookies.token).sub;
    let courseID = req.body.courseID;
    let instructorID = req.body.instructorID;

    let selectedCourse = await Course.findById(courseID, (err, course) => {
        console.log(course);
        return course.toObject()
    });

    if (selectedCourse.instructors.includes(userID)) {
        if (selectedCourse.instructors.includes(instructorID)){
            let update = {$pull: {}};
            update.$pull["students.$"] = studentID;
            let settingsUpdate = await Course.findOneAndUpdate({ "_id": courseID, "students._id": studentID }, update, { new: true })
    
            let Instructors = await User.find({"_id": { $in: selectedCourse.instructors }}, "", {lean: true})
            
            Instructors = Instructors.map((instructor) => {
                return {
                    "name": `${instructor.firstname} ${instructor.lastname}`,
                    "_id": instructor._id
                }
            })

            return res.send({settingsUpdate, Instructors})
        } else {
            let update = {$addToSet: {}};
            update.$addToSet["instructors.$"] = instructorID;
            let settingsUpdate = await Course.findOneAndUpdate({ "_id": courseID, "instructors._id": studentID }, update, { new: true })
            let Instructors = await User.find({"_id": { $in: selectedCourse.instructors }}, "", {lean: true})
            
            Instructors = Instructors.map((instructor) => {
                return {
                    "name": `${instructor.firstname} ${instructor.lastname}`,
                    "_id": instructor._id
                }
            })

            return res.send({settingsUpdate, Instructors})
        }
    } else {
        return res.status(500).send("User is not permitted to perform this action")
    }
})

router.get("/settings", async (req, res) => {
    let userID = JWT.decode(req.cookies.token).sub;
    let courseID = req.query.courseID;

    console.log(courseID);

    let selectedCourse = await Course.findById(courseID, (err, course) => {
        console.log(course);
        return course.toObject()
    });

    if (selectedCourse.instructors.includes(userID)) {
        let Students = await User.find({"_id": { $in: selectedCourse.students }}, "", {lean: true})
        
        Students = Students.map((student) => {
            return {
                "name": `${student.firstname} ${student.lastname}`,
                "_id": student._id
            }
        })

        let Instructors = await User.find({"_id": { $in: selectedCourse.instructors }}, "", {lean: true})
        
        Instructors = Instructors.map((instructor) => {
            return {
                "name": `${instructor.firstname} ${instructor.lastname}`,
                "_id": instructor._id
            }
        })

        console.log("Students: ", Students, "Instructors:", Instructors)

        return res.send({ Students, Instructors })
    } else {
        return res.status(500).send("User is not permitted to perform this action")
    }
})

//useful helper function for generating MongoDB updates
function generateUpdate(field, value) {
    const update = {"$set": {}}
    if(typeof value !== "undefined"){
        update.$set[field] = value;
    }
    return update;
}


module.exports = router;