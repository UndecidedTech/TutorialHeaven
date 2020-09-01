// eslint-disable-next-line strict
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

const whitelist = ["http://localhost:8080", "http://localhost:5000"];

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(cors({
    "origin": ["http://localhost:8080"],
    "credentials": true,
    "methods": ["OPTION", "GET", "POST", "DELETE", "PUT"]
}));

const port = process.env.PORT || 5000;

const users = require("./routes/api/users");
app.use("/api/users", users);

app.listen(port, () => console.log(`server started on ${port}`));

