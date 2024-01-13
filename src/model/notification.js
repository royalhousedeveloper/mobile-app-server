let mongoose = require('mongoose')

let notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        trim: true,
        type: String,
        required: true,
        default: Date()
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Admin'
    }
},{
    timestamps: true
})

let Notification = mongoose.model('notifications', notificationSchema)

module.exports = Notification