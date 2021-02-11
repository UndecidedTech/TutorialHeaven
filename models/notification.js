const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const notificationSchema = new Schema({
    courseId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    created_by: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    avi: {
        type: String,
        required: true
    },
    resource: {
        type: mongoose.SchemaTypes.Mixed,
        required: true
    }
})

const Notification = mongoose.model("notifications", notificationSchema);

module.exports = Notification;