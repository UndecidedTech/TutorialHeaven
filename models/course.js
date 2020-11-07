const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const answerSchema = new Schema({
    value: {
        type: String,
        required: false
    }
})

const contentSchema = new Schema({
    type: {
        enum: ["text", "multiple-choice", "open-ended", "matching"],
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
        type: answerSchema,
        required: false
    },
    incorrectAnswers: {
        type: [answerSchema],
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