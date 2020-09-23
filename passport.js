const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
// const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET = "minjaegamer"
const User = require("./models/user");
const LocalStrategy = require("passport-local").Strategy;

// JSON WEB TOKEN STRATEGY
// passport.use(new JwtStrategy({
//     jwtFromRequest: ExtractJwt.fromHeader("authorization"),
//     secretOrKey: JWT_SECRET
// }, async (payload, done) => {
//     try {
//     //find the user specified in the token
//         const user = await User.findById(payload.sub);
        
//     // If the user doesn't exist handle it        
//         if(!user){
//             return done(null, false);
//         }


//     //Otherwise return the user
//         done(null, user);
//     } catch(error) {
//         done(error, false)
//     }
// }));

//
passport.use(new LocalStrategy({
    usernameField: "email"
 }, async (email, password, done) => {
    try {
    //find the user given the email 
    let user = await User.findOne({
        email
    });
    //if not, handle it

    if (!user){
        return done(null, false);
    }

    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
        return done(null, false);
    }
    user = user.toObject();
    // delete the password :)
    delete user.password;
    // otherwise return the user
    done(null, user);
    } catch (error) {
        done(error, false);
    } 
}));