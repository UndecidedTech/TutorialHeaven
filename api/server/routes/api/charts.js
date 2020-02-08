/* eslint-disable no-shadow */
/* eslint-disable strict */
const express = require("express");
const mongodb = require("mongodb");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const session = require("express-session");
const url = "mongodb://192.168.1.10:27017/SkillSite";

const charts = [{
  "_id": "1",
  "title": ""
}];

// eslint-disable-next-line new-cap
const router = express.Router();

router.get()