let mongoose = require('mongoose')

let programRegistrationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: false,
        trim: true
    },
    date: {
        type: String,
        required: true,
        trim: true
    },
    registrationUri: {
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

let programRegistration = mongoose.model('programs', programRegistrationSchema)

module.exports = programRegistration