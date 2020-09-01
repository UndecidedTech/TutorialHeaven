/* eslint-disable strict */
const express = require("express");
const bcrypt = require("bcrypt");

// eslint-disable-next-line new-cap
const router = express.Router();

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
  console.log("here")
  const user = {
    "password": req.body.password,
    "username": req.body.username
  }

  try {
    const selectedUser = users[0];
    req.session.count += 1;
    console.log("Here: ", selectedUser);
    res.send(selectedUser);
  } catch(error) {
    console.error(error)
  }
})

router.get("/profile", async (req, res) => {
  console.log(req.session);
  if (!req.session.userId) {
    res.status(401).send("This user is not authenticated");
  } else {
    try {
      console.log("Entered");
      const users = await mongoConnect();
      const selectedUser = await users.findOne({
        "username": req.session.userId
      });
      delete selectedUser.password;
      res.send(selectedUser);
    } catch (error) {
      console.error(error);
    }
  }
})

router.get("/session", (req, res) => {
  console.log(req.sessionID);
  console.log(req.session.count);
  req.session.count += 1;
  if (!req.session.userId) {
    res.status(401).send("This user is not authenticated");
  } else {
    res.status(200).send("This user is authenticated");
  }
});

router.get("/signout", (req, res) => {
  req.session.destroy();
  console.log(req.sessionID);
  
  res.send("Session destroyed");
  
});

module.exports = router;