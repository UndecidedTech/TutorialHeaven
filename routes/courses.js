const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const JWT = require("jsonwebtoken");
const User = require("../models/user");

router.get("/getCourse/:courseID", async (req, res) => {
    let courseID = req.params.courseID;
    let userId = JWT.decode(req.cookies.token).sub

    console.log(courseID, userId)

    let selectedCourse = await Course.findById(courseID).lean();
    
    if (!selectedCourse){
        return res.status(404).send("Resource not found/doesn't exist")
    }
    
    if (selectedCourse.instructors.includes(userId) || selectedCourse.students.includes(userId)){
        res.send(selectedCourse)
    } else {
        res.status(404).send("User does not have access to this resource")
    }

});

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

router.post("/createSection", async (req, res) => {
  console.log(req.body)
  let courseID = req.body.courseID
  let newSection = {
    name: req.body.name,
    creator: true
  }
  let sectionCreate = await Course.findOneAndUpdate({"_id": courseID}, {$push: {"sections": newSection }}, {new: true})
  res.send(sectionCreate.toObject())
})

router.put("/updateCourse", async (req, res) => {
    let courseID = req.body.courseID;
    let userID = JWT.decode(req.cookies.token).sub
    let update = generateUpdate(req.body.field, req.body.value);

    let selectedCourse = await Course.findById(courseID).lean();

    // content
    if (selectedCourse.instructors.includes(userID)){
        let courseUpdate = await Course.findOneAndUpdate(courseID, update, {new: true})
        res.send(courseUpdate.toObject());
    } else {
        res.status(404).send("User does not have access to this resource")
    }
})

router.put("/updateSection", async (req, res) => {
    let courseID = req.body.courseID;
    let sectionID = req.body.sectionID;
    let userID = JWT.decode(req.cookies.token).sub;
    
    let selectedCourse = await Course.findById(courseID).lean();

    if (selectedCourse.instructors.includes(userID)){
        let update = { $set: {} }
        update.$set[`sections.$.${req.body.field}`] = req.body.value;
        let courseUpdate = await Course.findOneAndUpdate({ "_id": courseID, "sections._id": sectionID }, update, { new: true })
        res.send(courseUpdate);
        console.log(courseUpdate)
    }
})


router.post("/createSectionContent", async (req, res) => {
    let courseID = req.body.courseID;
    let sectionID = req.body.sectionID;
    let userID = JWT.decode(req.cookies.token).sub;
    let type = req.body.type;
    
    let selectedCourse = await Course.findById(courseID).lean();
    if (selectedCourse.instructors.includes(userID)) {
        let update = {$push: {}}
        update.$push["sections.$.content"] = { type };
        let sectionUpdate = await Course.findOneAndUpdate({"_id": courseID, "sections._id": sectionID }, update, { new: true })
        console.log(sectionUpdate);
        res.send(sectionUpdate);
    }
})

router.put("/updateSectionContent", async (req, res) => {
    let courseID = req.body.courseID;
    let sectionID = req.body.sectionID;
    let userID = JWT.decode(req.cookies.token).sub;
    let contentID = req.body.contentID;
    let value = req.body.value;

    console.log(req.body);
    let selectedCourse = await Course.findById(courseID).lean();
    if (selectedCourse.instructors.includes(userID)) {
        let update = {$set: {}}
        update.$set["sections.$.content.$[content].value"] = value;
        let sectionUpdate = await Course.findOneAndUpdate({"_id": courseID, "sections._id": sectionID }, update, { new: true, arrayFilters: [{ 'content._id' : contentID }] })
        console.log(sectionUpdate);
        res.send(sectionUpdate);
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