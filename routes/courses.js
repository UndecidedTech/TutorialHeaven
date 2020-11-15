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
  let userID = JWT.decode(req.cookies.token).sub;
  let courseID = req.body.courseID
  let newSection = {
    name: req.body.name,
    created_by: userID
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

router.post("/deleteSection", async (req, res) => {
    let courseID = req.body.courseID;
    let sectionID = req.body.sectionID;

    let userID = JWT.decode(req.cookies.token).sub;

    let selectedCourse = await Course.findById(courseID).lean();
    if (selectedCourse.instructors.includes(userID)) {
        let update = {$pull: {}}
        update.$pull["sections"] = { "_id": sectionID };
        let sectionUpdate = await Course.findOneAndUpdate({"_id": courseID }, update, { new: true })
        res.send(sectionUpdate)
    }
})

router.post("/createModule", async (req, res) => {
    let courseID = req.body.courseID;
    let sectionID = req.body.sectionID;
    let userID = JWT.decode(req.cookies.token).sub;

    let selectedCourse = await Course.findById(courseID).lean();
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

router.put("/updateModule", async (req, res) => {
    let courseID = req.body.courseID;
    let sectionID = req.body.sectionID;
    let moduleID = req.body.moduleID;
    let field = req.body.field;
    let value = req.body.value;
    let userID = JWT.decode(req.cookies.token).sub;
     
    let selectedCourse = await Course.findById(courseID).lean();

    if (selectedCourse.instructors.includes(userID)){
        let update = { $set: {} }
        update.$set[`sections.$.modules.$[module].${field}}`] = value;
        let moduleUpdate = await Course.findOneAndUpdate({ "_id": courseID, "sections._id": sectionID }, update, { new: true, arrayFilters: [{ 'module.id': moduleID}] })
        res.send(moduleUpdate)
        console.log(moduleUpdate)
    }
})

router.post("/deleteModule", async (req, res) => {
    let courseID = req.body.courseID;
    let sectionID = req.body.sectionID;
    let moduleID = req.body.moduleID;

    let userID = JWT.decode(req.cookies.token).sub;
    
    let selectedCourse = await Course.findById(courseID).lean();
    if (selectedCourse.instructors.includes(userID)) {
        let update = {$pull: {}}
        update.$pull["sections.$.modules"] = { "_id": moduleID };
        let moduleUpdate = await Course.findOneAndUpdate({"_id": courseID, "sections._id": sectionID}, update, { new: true })
        res.send(moduleUpdate)
    }
})

router.post("/createModuleContent", async (req, res) => {
    let courseID = req.body.courseID;
    let sectionID = req.body.sectionID;
    let moduleID =  req.body.moduleID
    let type = req.body.type;
    let userID = JWT.decode(req.cookies.token).sub;

    let selectedCourse = await Course.findById(courseID).lean();

    console.log(req.body)
    console.log(selectedCourse)
    if (selectedCourse.instructors.includes(userID)) {
        let update = {$push: {}}
        update.$push["sections.$.modules.$[module].content"] = { type };
        let moduleUpdate = await Course.findOneAndUpdate({"_id": courseID, "sections._id": sectionID }, update, { new: true, arrayFilters: [{ 'module._id': moduleID}] })
        res.send(moduleUpdate);
    }
})

router.put("/updateModuleContent", async (req, res) => {
    let courseID = req.body.courseID;
    let sectionID = req.body.sectionID;
    let contentID = req.body.contentID;
    let moduleID = req.body.moduleID;
    let userID = JWT.decode(req.cookies.token).sub;
    
    let value = req.body.value;

    console.log(req.body);
    let selectedCourse = await Course.findById(courseID).lean();
    if (selectedCourse.instructors.includes(userID)) {
        let update = {$set: {}}
        update.$set["sections.$.modules.$[module].content.$[content].value"] = value;
        let sectionUpdate = await Course.findOneAndUpdate({"_id": courseID, "sections._id": sectionID }, update, { new: true, arrayFilters: [{ 'module._id': moduleID }, { 'content._id' : contentID }] })
        console.log(sectionUpdate);
        res.send(sectionUpdate);
    }

})

router.post("/createAssessmentContent", async (req, res) => {
    let courseID = req.body.courseID;
    let sectionID = req.body.sectionID;
    let moduleID =  req.body.moduleID
    let type = req.body.type;

    let userID = JWT.decode(req.cookies.token).sub;
    console.log(req.body)
    let selectedCourse = await Course.findById(courseID).lean();
  
    if (selectedCourse.instructors.includes(userID)) {
        let update = {$push: {}}
        update.$push["sections.$.modules.$[module].content"] = { type };
        let assessmentUpdate = await Course.findOneAndUpdate({"_id": courseID, "sections._id": sectionID }, update, { new: true, arrayFilters: [{ 'module._id': moduleID}] })
        res.send(assessmentUpdate);
    }
})

router.put("/updateAssessmentContent", async (req, res) => {
    let courseID = req.body.courseID;
    let sectionID = req.body.sectionID;
    let moduleID = req.body.moduleID;
    

    let userID = JWT.decode(req.cookies.token).sub;

    let value = req.body.value
    console.log("reqbody", req.body.value)

    let selectedCourse = await Course.findById(courseID).lean();
    if(selectedCourse.instructors.includes(userID)) {
        let update = {$set: {}}
        update.$set["sections.$.modules.$[module].content"] = value;
        let assessmentUpdate = await Course.findOneAndUpdate({"_id": courseID, "sections._id": sectionID }, update, { new: true, arrayFilters: [{ 'module._id': moduleID }] });
        console.log(assessmentUpdate);
        res.send(assessmentUpdate);
    }
})

router.post("/deleteAssessmentContent", async (req, res) => {
    let courseID = req.body.courseID;
    let sectionID = req.body.sectionID;
    let contentID = req.body.contentID;
    let moduleID = req.body.moduleID;

    let userID = JWT.decode(req.cookies.token).sub;

    let selectedCourse = await Course.findById(courseID).lean();
    if (selectedCourse.instructors.includes(userID)) {
        let update = {$pull: {}}
        update.$pull[`sections.$.modules.$[module].content`] = { "_id": contentID };
        let assessmentUpdate = await Course.findOneAndUpdate({"_id": courseID, "sections._id": sectionID}, update, { new: true, arrayFilters: [{ 'module._id': moduleID }] })
        res.send(assessmentUpdate)
    }
})

router.post("/deleteModuleContent", async (req, res) => {
    let courseID = req.body.courseID;
    let sectionID = req.body.sectionID;
    let contentID = req.body.contentID;
    let moduleID = req.body.moduleID;

    let userID = JWT.decode(req.cookies.token).sub;

    let selectedCourse = await Course.findById(courseID).lean();
    if (selectedCourse.instructors.includes(userID)) {
        let update = {$pull: {}}
        update.$pull["sections.$.modules.$[module].content"] = { "_id": contentID };
        let moduleUpdate = await Course.findOneAndUpdate({"_id": courseID, "sections._id": sectionID}, update, { new: true, arrayFilters: [{ 'module._id': moduleID }] })
        res.send(moduleUpdate)
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