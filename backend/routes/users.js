/* eslint-disable strict */
const express = require("express");
const passport = require("passport");
const passportConf = require("../passport.js");
const passportJWT = passport.authenticate("jwt", {session: false});
const UsersController = require("../controllers/users");



// eslint-disable-next-line new-cap
const router = express.Router();

router.route("/signup")
  .post(passportJWT, UsersController.signUp);

router.route("/signin")
  .post(UsersController.signUp);



module.exports = router;