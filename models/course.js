const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    course_name: {
        type: String,
        required: true
    },
    subject: {
        type: Array,
        default: []
    },
    sections: {
        type: Array,
        default: [],
    },
    subscription: {
        type: Boolean,
        required: true
    }
})