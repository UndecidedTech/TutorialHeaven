// eslint-disable-next-line strict
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
const session = require("express-session");


const whitelist = ["http://localhost:8080", "http://localhost:5000"];


app.use(session({
    secret: "secret",
    resave: false,
    httpOnly: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 60000
    }
}));

app.use(bodyParser.json());
app.use(cors({
    "origin": ["http://localhost:8080"],
    "credentials": true,
    "methods": ["GET", "POST"]
}));
const port = process.env.PORT || 5000;

const users = require("./routes/api/users");
app.use("/api/users", users);

app.listen(port, () => console.log(`server started on ${port}`));

