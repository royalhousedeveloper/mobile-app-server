let mongoose = require('mongoose')

let mediaSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: false,
        trim: true
    },
    mediaUri: {
        type: String,
        required: true,
        trim: true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Admin'
    }
},{
    timestamps: true
})

let Media = mongoose.model('media', mediaSchema)

module.exports = Media