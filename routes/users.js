/* eslint-disable strict */
require("dotenv").config();
const express = require("express");
const passport = require("passport");
const passportConf = require("../passport.js");
const passportJWT = passport.authenticate("jwt", {session: false});
const JWT = require("jsonwebtoken");
const UsersController = require("../controllers/users");
const User = require("../models/user")
const Course = require("../models/course");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const { ObjectID, ObjectId } = require("mongodb");
const { response } = require("express");
const Notification = require("../models/notification")


// eslint-disable-next-line new-cap
const router = express.Router();

/** 
* @api {post} /signup Sign Up
* @apiName signUp
* @apiGroup Users
*
* @apiParam {String} query String used for partial match regex search on Course names.
*/

// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword

router.route("/signup")
  .post(UsersController.signUp);

/** 
* @api {post} /signin Sign In
* @apiName signIn
* @apiGroup Users
*
* @apiParam {String} query String used for partial match regex search on Course names.
*/

// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword

router.route("/signin")
  .post(passport.authenticate("local", {session: false}), UsersController.signIn);

/** 
* @api {get} /profile/:userId Get User ID
* @apiName getUserId
* @apiGroup Users
*
* @apiParam {String} query String used for partial match regex search on Course names.
*/

// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword

router.get("/profile/:userId", async (req, res) => {
    let userId = req.params.userId;
    let selectedUser = await User.findOne({"_id": userId}, (err, user) => {
      return user.toObject();
    });

    let returnValue = { ...selectedUser._doc };
    delete returnValue.password;
    if (selectedUser)
      res.status(200).send(returnValue);
    else
      res.status(404).send("User not found");
  });

/** 
* @api {post} /profile Profile
* @apiName profile
* @apiGroup Users
*
* @apiParam {String} query String used for partial match regex search on Course names.
*/

// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword

router.post("/profile", [
  check("userId", "User ID should not be empty/Must be ObjectID").not().isEmpty().customSanitizer(value => {
    return ObjectID.isValid(value)
  })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let tokenId = JWT.decode(req.cookies.token).sub
  let userId = req.body.userId;
  console.log(tokenId, userId)
  if (tokenId === userId){
    let update = generateUpdate(req.body.field, req.body.value);

    let selectedUser = await User.findByIdAndUpdate(userId, update, {new: true}).select("-password").lean();
      if(selectedUser)
        res.status(200).send(selectedUser);
      else
        res.status(404).send("User not found");
  } else {
    res.status(404).send("User not authorized to perform this action")
  }
})

/** 
* @api {post} /forgot Forgot Password
* @apiName forgotPassword
* @apiGroup Users
*
* @apiParam {String} query String used for partial match regex search on Course names.
*/

// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword

router.post("/forgot", async (req, res) => {
  console.log("forgotPassword triggered")

  const token =  await crypto.randomBytes(20).toString("hex");

  console.log(req.body.email);
  let selectedUser = await User.findOne({ email: req.body.email }).select("-password -resetPasswordToken -resetPasswordExpires");

  console.log(selectedUser);
  if (selectedUser){
    await User.findByIdAndUpdate(selectedUser._id, {$set: {
      "resetPasswordToken": token,
      "resetPasswordExpires": Date.now() + 3600000 // 1 hour
    }})

    const smtpTransport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "tutorialheaveninfo@gmail.com",
        pass: process.env.GMAILPW
      }
    });

    let port = req.headers.host.slice(-4);
    let URL = req.headers.host;
    
    console.log("port: ", typeof port, port);

    if (port === "3000") {
      URL = req.headers.host.substr(0,10).concat("8080")
    }

    const mailOptions = {
      to: selectedUser.email,
      from: "tutorialheaveninfo@gmail.com",
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) has requested the rest of the password for this account.\n
      Please click on the following link or paste it into the browser to complete the process:\n
      http://${URL}/reset/${token} \n\n
      if you did not request this, please ignore this email and your password will remain unchanged`
    };

    smtpTransport.sendMail(mailOptions, (err) => {
      if (err){
        res.status(404).send("Email failed to send")
      } else {
        console.log("email sent")
        res.send("Email has been sent.");
      }
    })

  } else {
    res.status(404).send("Email not found")
  }
})

/** 
* @api {get} /reset/:token Get Reset Token
* @apiName token
* @apiGroup Users
*
* @apiParam {String} query String used for partial match regex search on Course names.
*/

// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword

router.get('/reset/:token', async (req, res) => {
  console.log(req.params.token)
  let selectedUser = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now() }})

  if (selectedUser){
    res.send("Token exists");
  } else {
    res.status(404).send("Password reset token is invalid or has expired.");
  }
})

/** 
* @api {post} /reset/:token Reset Token
* @apiName emailToken
* @apiGroup Users
*
* @apiParam {String} query String used for partial match regex search on Course names.
*/

// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword

router.post("/reset/:token", async (req, res) => {
  let selectedUser = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }})
  if (selectedUser){
    if (req.body.password) {
      let userId = await selectedUser.toObject()._id
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(req.body.password, salt);
      let updatedUser = await User.findByIdAndUpdate(userId, {
        password: passwordHash,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined
      }, {new: true})
      

      // send confirmation email to user that password has been reset

      if (updatedUser){
        const smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "tutorialheaveninfo@gmail.com",
            pass: process.env.GMAILPW
          }
        });

        const mailOptions = {
          to: selectedUser.email,
          from: "tutorialheaveninfo@gmail.com",
          subject: "Password Reset Successful",
          text: `You are receiving this because you (or someone else) has reset the password for this account.\n
          If you did not request this, please contact TutorialHeaven for help.`
        };

        smtpTransport.sendMail(mailOptions, (err) => {
            if (err){
              res.status(404).send("Email failed to send")
            }
          })
      }
      
      res.send("Password has been reset")
      // login user and send back user details
      // res.send(selectedUser)
    }
  } else {
    res.status(404).send("Password reset token is invalid or has expired");
  }
  
})

/** 
* @api {post} /saveAssessment Save Assessment
* @apiName saveAssessment
* @apiGroup Users
*
* @apiParam {String} query String used for partial match regex search on Course names.
*/

// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword

router.post("/saveAssessment", async (req, res) => {
  let courseID = req.body.courseID;
  let sectionID = req.body.sectionID;
  // let contentID = req.body.contentID;
  let moduleID = req.body.moduleID;

  let responses = req.body.responses;

  let userID = JWT.decode(req.cookies.token).sub;

  userID = ObjectID(userID)
  
  console.log(userID);
  let selectedCourse = await Course.findOne({ "_id": courseID, "students": userID, "sections": {$elemMatch: { "_id": ObjectId(sectionID), "modules":{ $elemMatch: { "_id": ObjectId(moduleID) } } }} }, { "sections.modules.$": 1}, (err, course) => {
    return course.toObject();
  })
  console.log("TestingAssessment: ", selectedCourse);

  // select the Assessment Object 
  let selectedAssessment = selectedCourse.sections[0].modules.find((module) => {
    let modID = module._id.toString();
    if (module.type !== "assessment") {
      return undefined;
    }
    
    if (moduleID === modID) {
      console.log("WE HERE BR0");
      return module;
    }
  })

  console.log(selectedAssessment);

  // check that user hasn't already started assessment
  let checkUser = await User.findOne({ "_id": userID, "courses": {$elemMatch: { "_id": ObjectId(courseID), "results": { $elemMatch: { "_id": selectedAssessment._id } }}}}, (err, user) => {
    console.log(user);
    return user
  })

  console.log("User Check Stage: ", checkUser);


  responses = responses.map((response) => {
    return {
      "value": response.value
    }
  })

  console.log("AfterMap: ", responses);

  if (checkUser !== null) {
  
    let update = {$set: {} }
    update.$set["courses.$[course].results.$[result].responses"] = responses;
    console.log(userID);
    let userUpdate = await User.findOneAndUpdate({ "_id": userID }, update, { new: true, arrayFilters: [{"course._id": ObjectId(courseID)}, {"result._id": ObjectId(selectedAssessment._id)}]}, (err, user) => {
      console.log("errorLine: ", user)
      return user.toObject();
    })
    
    return res.status(404).send(userUpdate.toObject());
  
  } else {
   console.log("RAN THIS CODE"); 
    let update = {$addToSet: {} };
    update.$addToSet["courses.$[course].results"] = {
      "_id": selectedAssessment._id,
      "score": undefined,
      "responses": responses 
    }
    console.log("update: ", update);
    let userUpdate = await User.findOneAndUpdate({"_id": userID}, update, { new: true, arrayFilters: [{"course._id": courseID}]}, (err, user) => {
      return user.toObject();
    })
  
    return res.send(userUpdate);
  }
})

/** 
* @api {post} /submitAssessment Submit Assessment
* @apiName submitAssessment
* @apiGroup Users
*
* @apiParam {String} query String used for partial match regex search on Course names.
*/

// get endpoint
// TODO: 
//  sort by popularity
//  filter by keyword

router.post("/submitAssessment", async (req, res) => {
  let courseID = req.body.courseID;
  let sectionID = req.body.sectionID;
  // let contentID = req.body.contentID;
  let moduleID = req.body.moduleID;
  let responses = req.body.responses;
  let userID = JWT.decode(req.cookies.token).sub;


  // userID = ObjectID(userID)


  let selectedCourse2 = await Course.findOne({ "_id": courseID, "students": userID }, (err, course) => {
    console.log(course)
    return course.toObject();
  })

  let selectedCourse = await Course.findOne({ "_id": courseID, "students": userID, "sections": {$elemMatch: { "_id": ObjectId(sectionID), "modules":{ $elemMatch: { "_id": ObjectId(moduleID) } } }} }, { "sections.modules.$": 1}, (err, course) => {
    return course.toObject();
  })
  console.log("TestingAssessment: ", selectedCourse);

  // select the Assessment Object 
  let selectedAssessment = selectedCourse.sections[0].modules.find((module) => {
    let modID = module._id.toString();
    if (module.type !== "assessment") {
      return undefined;
    }
    
    if (moduleID === modID) {
      console.log("WE HERE BR0");
      return module;
    }
  })

  responses = responses.map((response) => {
    return {
      "value": response.value
    }
  })
  let subjects = {}

  let correctCount = 0;
  for (let i = 0; i < responses.length; i++) {
    console.log(selectedAssessment.content[i].subject)
    if (!(`${selectedAssessment.content[i].subject}` in subjects)) {
      subjects[`${selectedAssessment.content[i].subject}`] = [0,0]
    }

    if (responses[i].value === selectedAssessment.content[i].answer) {
      responses[i]["correct"] = true;
      subjects[selectedAssessment.content[i].subject][0]++
      subjects[selectedAssessment.content[i].subject][1]++
      correctCount++;
    } else {
      subjects[selectedAssessment.content[i].subject][1]++
      responses[i]["correct"] = false;
    }
  }



  let score = Math.ceil(((correctCount/responses.length) * 100));

  // check percentage of answers correct and set their score

  let notifData = {
    courseId: courseID,
    courseName: selectedCourse2.name,
    title: `${selectedAssessment.name} has been graded`,
    content: `Go view your grade for ${selectedAssessment.name} in ${selectedCourse2.name}.`,
    avi: selectedCourse2.image,
    resource: {
      type: "courses",
      _id: sectionID
    },
    subresource: {
      type: "assessment",
      _id: selectedAssessment._id
    },
    members: [userID]
  }

  console.log(notifData);

  await new Notification(notifData).save()

  // check that user has already started assessment
  let checkUser = await User.findOne({ "_id": userID, "courses": {$elemMatch: { "_id": ObjectId(courseID), "results": { $elemMatch: { "_id": selectedAssessment._id } }}}}, { "courses.results.$": 1}, (err, user) => {
    return user;
  })

  let grade = undefined;

  if (checkUser !== null){
    // get user results and pass to array for finding Avg Score in the course
    let results = []
    checkUser.courses[0].results.forEach((result) => {
      results.push(result.score)
    })
    results.push(score)
    console.log("results: ", results)
    // calculate average
    grade = await getAvg(results);

    console.log("Average Grade: ", results)
    console.log("Alex is null here??????????");
    checkUser = checkUser.courses[0].results.find((result) => {
      let resID = result._id.toString();
      console.log(result); 
      if (resID === moduleID) {
        console.log("WE HERE BR0");
        return result;
      }
    })
  } else {
    let results = [score];
    grade = await getAvg(results)
  }

  if (checkUser !== null && checkUser.submitted === false) {
    
    let update = {$set: {}, $push: {}}
    update.$set["courses.$[course].results.$[result].responses"] = responses;
    update.$set["courses.$[course].results.$[result].submitted"] = true;
    update.$set["courses.$[course].results.$[result].score"] = score;
    update.$set["courses.$[course].results.$[result].subjects"] = subjects;
    update.$addToSet["courses.$[course].grades"] = {
      timestamp: new Date(),
      score: grade
    }

    let userUpdate = await User.findOneAndUpdate({"_id": userID}, update, { "fields": {"password": 0, "resetPasswordToken": 0, "resetPasswordExpires": 0}, new: true, arrayFilters: [{"course._id": courseID }, { "result._id": ObjectId(moduleID)}]}, (err, user) => {
      return user
    })
    
    return res.send(userUpdate.toObject());
  
  } else if (checkUser !== null && checkUser.submitted === true) {
    res.send("Assignment already submitted");
  } else {
    console.log("NEVER STARTED SAVE");  
    let update = {$addToSet: {}, $push: {} };
    update.$addToSet["courses.$[course].results"] = {
      "_id": selectedAssessment._id,
      "score": score,
      "responses": responses,
      "submitted": true,
      "subjects": subjects
    }
    update.$addToSet["courses.$[course].grades"] = {
      timestamp: new Date(),
      score: grade
    }
    
    let userUpdate = await User.findOneAndUpdate({"_id": userID}, update, { "fields": { "password": 0, "resetPasswordToken": 0, "resetPasswordExpires": 0 }, new: true, arrayFilters: [{ "course._id": courseID }]}, (err, user) => {
      return user.toObject();
    })
    
    return res.send(userUpdate.toObject());
  }
}),
// useful helper function
function generateUpdate(field, value) {
  const update = {"$set": {}}
  if(typeof value !== "undefined") {
      update.$set[field] = value;
  }
  return update;
}

function getAvg(array) {
  let sum = array.reduce((a, b) => a + b, 0);
  let n = array.length;
  return (Math.ceil(sum/n))
}

module.exports = router;