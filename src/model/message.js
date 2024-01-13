let mongoose = require('mongoose')

let messageSchema = new mongoose.Schema({
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
    author: {
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

let Message = mongoose.model('messages', messageSchema)

module.exports = Message