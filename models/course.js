const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const answerSchema = new Schema({
    value: {
        type: String,
        required: false
    }
})

const questionSchema = new Schema({
    type: {
        enum: ["multiple-choice", "open-ended", "matching"],
        type: String,
        required: true
    },
    answer: answerSchema,
    question: {
        type: String,
        default: "",
        required: false
    },
    incorrectAnswers: [answerSchema]
})
const contentSchema = new Schema({
    type: {
        enum: ["text", "video", "assessment", "file"],
        type: String,
        required: true
    },
    value: {
        type: String,
        default: ""
    }
})

const moduleSchema = new Schema({
  title: {
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
  content: [questionSchema || contentSchema]
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
        type: Array,
        required: true
    },
    students: {
        type: Array,
        default: []
    },
    name: {
        type: String,
        required: true
    },
    subject: {
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