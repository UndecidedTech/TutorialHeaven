/* eslint-disable strict */
const express = require("express");
const passport = require("passport");
const passportConf = require("../passport.js");
const passportJWT = passport.authenticate("jwt", {session: false});
const UsersController = require("../controllers/users");
const User = require("../models/user")



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

module.exports = router;