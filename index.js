/* eslint-disable no-undef */
/* eslint-disable camelcase */
/* eslint-disable no-process-env */
// eslint-disable-next-line strict
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const history = require("connect-history-api-fallback");

// connection string info
const db_ip = process.env.DB_IP;
const db_user = process.env.DB_USER;
const db_pass = process.env.DB_PASS;
const url = `mongodb://${db_user}:${db_pass}@${db_ip}/Dev?authSource=admin`;

// Express app instantiation
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
    "origin": ["http://localhost:8081", "http://localhost:8080"],
    "credentials": true,
    "methods": ["OPTIONS", "GET", "POST", "PUT"]
  }));

  console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === "production") {
  app.use(history())
}

mongoose.connect(url, {"useNewUrlParser": true, "useUnifiedTopology": true, "useFindAndModify": false});
mongoose.Promise = global.Promise;
mongoose.set("useCreateIndex", true);

//rate limiter to protect endpoints
const postLimit = rateLimit({
  windowMs: 1000 * 60 * 5,
  max: 100
})
const replyLimit = rateLimit({
  windowsMs: 1000 * 30,
  max: 5
})

const port = process.env.PORT || 3000;


const users = require("./routes/users");
app.use("/api/users", users);

const images = require("./routes/images");
app.use("/api/images", images);

const courses = require("./routes/courses");
app.use("/api/courses", courses);

const catalog = require("./routes/catalog")
app.use("/api/catalog", catalog)

const forum = require("./routes/forum")
app.use("/api/forum", forum)

const notifications = require("./routes/notifications")
app.use("/api/notifications", notifications)

const statistics = require("./routes/statistics")
app.use("/api/statistics", statistics)

app.use(express.static("./public"));
app.listen(port, () => console.log(`Server started on ${port}`));

