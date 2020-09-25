/* eslint-disable no-undef */
/* eslint-disable camelcase */
/* eslint-disable no-process-env */
// eslint-disable-next-line strict
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// connection string info
const db_ip = process.env.DB_IP;
const db_user = process.env.DB_USER;
const db_pass = process.env.DB_PASS;
const url = `mongodb://${db_user}:${db_pass}@${db_ip}:27017/Dev?authSource=admin`;

// Express app instantiation
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(cors({
    "origin": ["http://localhost:8081", "http://localhost:8080"],
    "credentials": true,
    "methods": ["OPTIONS", "GET", "POST", "PUT"]
  }));

mongoose.Promise = global.Promise;
mongoose.connect(url, {"useNewUrlParser": true, "useUnifiedTopology": true, "useFindAndModify": false});

const port = process.env.PORT || 3000;

const users = require("./routes/users");

app.use("/api/users", users);

const images = require("./routes/images");

app.use("/api/images", images);

app.use(express.static("public"));
app.listen(port, () => console.log(`Server started on ${port}`));
