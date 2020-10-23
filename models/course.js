const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sectionContentSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    value: {
        type: String,
        default: ""
    }
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
  content: [sectionContentSchema]
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