// eslint-disable-next-line strict
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
const session = require("express-session");
const redis = require("redis");
let RedisStore = require("connect-redis")(session)
let redisClient = redis.createClient();

// add to session: {store: new RedisStore({client: redisClient})},


const whitelist = ["http://localhost:8080", "http://localhost:5000"];

app.set("trust proxy", 1);
app.use(session({
    store: new RedisStore({host: "localhost", client: redisClient, port: 6379}),
    secret: "secret",
    resave: false,
    httpOnly: true,
    saveUninitialized: true,
    cookie: {
        secure: false
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

