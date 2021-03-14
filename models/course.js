const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contentSchema = new Schema({
    type: {
        enum: ["text", "multiple-choice", "open-ended", "matching", "trueFalse"],
        type: String,
        required: true
    },
    value: {
        type: String,
        default: ""
    },
    question: {
        type: String,
        default: "",
        required: false
    },
    answer: {
        type: String,
        default: "",
        required: false
    },
    choices: {
        type: Array,
        required: false
    },
    relation: {
        type: Schema.Types.ObjectId,
        required: false
    },
    subject: {
        type: String,
        required: false
    }
})

const moduleSchema = new Schema({
  name: {
      type: String,
      required: true
  },
  description: {
      type: String,
      required: false,
      default: ""
  },
  type: {
    enum: ["content", "assessment"],
    type: String,
    required: true
  },
  content: [contentSchema]
})

const sectionSchema = new Schema({
  created_by: {
      type: Schema.Types.ObjectId,
      required: true
  },
  name: {
      type: String,
      required: true
  },
  modules: [moduleSchema]
})

const courseSchema = new Schema({
    created_by: {
        type: Schema.Types.ObjectId,
        required: true
    },
    instructors: {
        type: [Schema.Types.ObjectId],
        required: true
    },
    students: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        default: ""
    },
    image: {
        type: String,
        required: false,
        default: "https://tutorialheaven.s3.us-east-2.amazonaws.com/defaultAvatar.png"
    },
    category: {
        type: Array,
        default: [] 
    },
    subjects: {
        type: Array,
        default: []
    },
    sections: [sectionSchema],
    subscription: {
        type: Boolean,
        required: true
    }
})


const Course = mongoose.model("courses", courseSchema);

module.exports = Course;