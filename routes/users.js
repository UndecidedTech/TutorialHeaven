/* eslint-disable strict */
require("dotenv").config();
const express = require("express");
const passport = require("passport");
const passportConf = require("../passport.js");
const passportJWT = passport.authenticate("jwt", {session: false});
const JWT = require("jsonwebtoken");
const UsersController = require("../controllers/users");
const User = require("../models/user")
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const { ObjectID } = require("mongodb");


// eslint-disable-next-line new-cap
const router = express.Router();

router.route("/signup")
  .post(UsersController.signUp);

router.route("/signin")
  .post(passport.authenticate("local", {session: false}), UsersController.signIn);

router.get("/profile/:userId", async (req, res) => {
    let userId = req.params.userId;
    let selectedUser = await User.findOne({"_id": userId}, (err, user) => {
      return user.toObject();
    });

    let returnValue = {...selectedUser._doc};
    delete returnValue.password;
    if (selectedUser)
      res.status(200).send(returnValue);
    else
      res.status(404).send("User not found");
  });

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

router.get('/reset/:token', async (req, res) => {
  console.log(req.params.token)
  let selectedUser = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now() }})

  if (selectedUser){
    res.send("Token exists");
  } else {
    res.status(404).send("Password reset token is invalid or has expired.");
  }
})

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

//     "password" : "$2a$10$ObwB1J8OCYvspMe7lA89xuPk29eUvRo/ATRB1saL0zvOglENHt1ze",

// useful helper function
function generateUpdate(field, value) {
  const update = {"$set": {}}
  if(typeof value !== "undefined") {
      update.$set[field] = value;
  }
  return update;
}


module.exports = router;