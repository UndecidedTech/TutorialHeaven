/* eslint-disable strict */
const express = require("express");
const mongodb = require("mongodb");
const {MongoClient} = require("mongodb");
const bcrypt = require("bcrypt");
const session = require("express-session");
const url = "mongodb://brainrainAdmin:Bra1nRa1n!@brainraindb:27017";

const users = [{"_id": "1",
  "username": "bran",
  "password": "bran"}];

// eslint-disable-next-line new-cap
const router = express.Router();

const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect("/login");
  } else {
    next();
  }
};

const redirectHome = (req, res, next) => {
  if (req.session.userId) {
    res.redirect("/home");
  } else {
    next();
  }
};
// Get POSTS
router.get("/", (req, res) => {
  res.send("Here");
});

// Add Posts
router.post("/create", async (req, res) => {
  const item = {
    "password": req.body.password,
    "username": req.body.username,
    "email": req.body.email
  };
  try {
    const hashedPassword = await bcrypt.hash(item.password, 10);
    item.password = hashedPassword;
    const users = await mongoConnect();
    const returnValue = await users.insertOne(item);
    delete returnValue.ops[0].password;
    delete returnValue.ops[0].email;
    console.log(returnValue.ops[0]);
    res.status(200).send(returnValue.ops[0]);
  } catch (error) {
    res.status(500).send("This User is FUcked");
  }

});


router.post("/signin", async (req, res) => {
  const user = {
    "password": req.body.password,
    "username": req.body.username
  }
  try {
    const users = await mongoConnect();
    const a = await users.findOne({"username": user.username})
    const status = await bcrypt.compare(user.password,a.password)
    if (status) {
      req.session.user = user.username;
      req.session.save();
      delete a.password;
      delete a.email;
      req.session.cookie.secure = false;
      req.session.userId = userInput.username;
      res.send(a);
      console.log(req.session);
  } else {
      res.status(500).send("Password was incorrect");
  }
  } catch(error) {
  console.error(error);
 }
 });
 

// router.post("/signin", redirectHome, (req, res) => {
//   const userInput = {
//     "password": req.body.password,
//     "username": req.body.username
//   };
//   try {
//     users.find((user) => {
//       if (user.username === userInput.username) {
//         console.log("successful");
//         req.session.cookie.secure = false;
//         req.session.some_var = userInput.username;
//         res.send(user);
//       }
//     });
//   } catch (error) {
//     console.error(error);
//   }
// });


router.get("/session", (req, res) => {
  console.log(req.session);
  if (!req.session.user) {
    res.status(401).send("This user is not authenticated");
  } else {
    res.status(200).send("This user is authenticated");
  }
});

router.get("/signout", (req, res) => {
  req.session.destroy();
  res.send("Session destroyed");
});

/*
 *Router.get("/", (req, res) => {
 * if(req.session.user){
 *
 * user = await mongoConnect();
 * const a = await users.findOne({"username": user.username})
 * }
 *
 *
 *
 * })
 */


async function mongoConnect() {
  const client = await mongodb.MongoClient.connect(url, {
    "useNewUrlParser": true
  });
  return client.db("BrainRain").collection("users");
}

// Delete Posts

module.exports = router;

