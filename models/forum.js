const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    created_by: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    created_on: {
        type: Date,
        default: Date() 
    },
    text: {
        type: String,
        required: true
    },
    likes: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: []
    }
}) 

const threadSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false,
        default: "https://tutorialheaven.s3.us-east-2.amazonaws.com/defaultAvatar.png"
    },
    created_by: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    created_on: {
        type: Date,
        default: Date()
    },
    posts: {
        type: [postSchema],
        default: []
    },
    likes: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: []
    }
})

const forumSchema = new Schema({
    courseId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    threads: {
        type: [threadSchema],
        default: []
    }
})

const Forum = mongoose.model("forums", forumSchema);

module.exports = Forum;