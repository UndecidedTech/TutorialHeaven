const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const responseSchema = new Schema({
    value: {
        type: String,
        default: ""
    },
    correct: {
        type: Boolean,
        required: false 
    }
})

const resultSchema = new Schema({
    submitted: {
        type: Boolean,
        default: false,
        required: false
    },
    score: {
        type: Number,
        default: undefined,
        required: false
    },
    subjects: {
        type: Schema.Types.Mixed,
        default: {}
    },
    responses: {
        type: [responseSchema],
        default: [],
        required: false
    }
})

const gradeSchema = new Schema({
    timestamp:{
        type: Date,
        required: false,
        default: Date()
    },
    score: {
        type: Number,
        required: true
    }
})

const courseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    subject: {
        type: Array,
        required: true
    },
    role: {
        enum: ["student", "instructor"],
        type: String,
        required: true
    },
    creator: {
        type: Boolean,
        required: true
    },
    results: {
        type: [resultSchema],
        default: [],
        required: false
    },
    timestamp: {
        type: Date,
        default: Date()
    },
    grades: {
        type: [gradeSchema],
        default: []
    }
})

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    avi: {
        type: String,
        default: "https://tutorialheaven.s3.us-east-2.amazonaws.com/defaultAvatar.png"
    },
    courses: {
        type: [courseSchema],
        default: []
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    read_notifications: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: []
    }
});

userSchema.pre("save", async function(next) {
    try {
        //generate a salt
        const salt = await bcrypt.genSalt(10);
        //generate salted password hash
        const passwordHash = await bcrypt.hash(this.password, salt);
        // assign hashed password over original
        this.password = passwordHash;
        next();
    } catch (error) {
        next(error);
    } 
})

userSchema.methods.isValidPassword = async function(newPassword) {
    try {
       return bcrypt.compare(newPassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
}

const User = mongoose.model("users", userSchema);

module.exports = User;