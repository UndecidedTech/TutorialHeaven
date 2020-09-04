require("dotenv").config();
const JWT = require("jsonwebtoken");
const User = require("../models/user");
const JWT_SECRET = process.env.JWT_SECRET;

signToken = user => {
    return JWT.sign({
        iss: "T2",
        sub: user._id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() +1)
    }, JWT_SECRET)
}

module.exports = {
    signUp: async (req, res, next) => {
        console.log("TriggeredDDD");
        const {email, firstname, lastname, password} = req.body;

        const foundUser = await User.findOne({"email": email}).select("email _id");

        if (foundUser) {
            return res.status(403).send({
                error: "Email is already in use"
            })
        }


        const newUser = new User({
            email,
            firstname,
            lastname,
            password
        })

        await newUser.save();

        let createdUser = await newUser.toObject();
        delete createdUser.password
        
        const token = signToken(createdUser);
        res.cookie("token", token).send(createdUser);

    },
    signIn: async (req, res, next) => {
        console.log("is anything fucking happening")
        // generate token
        const token = signToken(req.user);
        res.cookie("token", token).send(req.user); 
    },
    secret: async (req, res, next) => {
        console.log("Can I use this for auth?");
        res.json({
            secret: "resource"
        })
    }
}