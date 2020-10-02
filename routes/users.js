/* eslint-disable strict */
const express = require("express");
const passport = require("passport");
const passportConf = require("../passport.js");
const passportJWT = passport.authenticate("jwt", {session: false});
const JWT = require("jsonwebtoken");
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

router.post("/profile/", async (req, res) => {
  let tokenId = JWT.decode(req.cookies.token).sub
  let userId = req.query.userId

  if (tokenId === userId){
    let update = generateUpdate(req.body.field, req.body.value);

    let selectedUser = await User.findByIdAndUpdate(userId, update).select("-password").lean();
      if(selectedUser)
        res.status(200).send(selectedUser);
      else
        res.status(404).send("User not found");
  } else {
    res.status(404).send("User not authorized to perform this action")
  }
})

// useful helper function
function generateUpdate(field, value) {
  const update = {"$set": {}}
  if(typeof value !== "undefined") {
      update.$set[field] = value;
  }
  return update;
}


module.exports = router;