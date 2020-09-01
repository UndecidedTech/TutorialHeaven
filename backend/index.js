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
const url = `mongodb://${db_user}:${db_pass}@${db_ip}:27017`;

// Express app instantiation
const app = express();

const whitelist = ["http://localhost:8080", "http://localhost:5000"];

// Middleware
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(cors({
    "origin": ["http://localhost:8080"],
    "credentials": true,
    "methods": ["OPTION", "GET", "POST", "DELETE", "PUT"]
}));

mongoose.Promise = global.Promise;
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const port = process.env.PORT || 5000;

const users = require("./routes/api/users");

app.use("/api/users", users);

app.listen(port, () => console.log(`server started on ${port}`));

