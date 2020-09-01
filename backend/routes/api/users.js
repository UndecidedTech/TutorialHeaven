/* eslint-disable strict */
const express = require("express");
const mongodb = require("mongodb");
const {
  MongoClient
} = require("mongodb");
const bcrypt = require("bcrypt");
const db_ip = process.env.DB_IP;
const db_user = process.env.DB_USER;
const db_pass = process.env.DB_PASS;
const url = `mongodb://${db_user}:${db_pass}@${db_ip}:27017`;

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



/* router.post("/signin", async (req, res) => {
  const user = {
    "password": req.body.password,
    "username": req.body.username
  }
  try {
    const users = await mongoConnect();
    const selectedUser = await users.findOne({
      "username": user.username
    })
    const status = await bcrypt.compare(user.password, selectedUser.password)
    if (status) {
      const token = jwt.sign({ username }, jwtKey, {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds
      })
      console.log("token: ", token);
      res.send(selectedUser);
      console.log(req.session);
    } else {
      res.status(500).send("Password was incorrect");
    }
  } catch (error) {
    console.error(error);
  }
}); */

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


async function mongoConnect() {
  const client = await mongodb.MongoClient.connect(url, {
    "useNewUrlParser": true
  });
  return client.db("BrainRain").collection("users");
}

// Delete Posts

module.exports = router;