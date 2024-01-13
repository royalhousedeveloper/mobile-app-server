let mongoose = require('mongoose')

let devotionSchema = new mongoose.Schema({
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
    imageUri: {
        type: String,
        required: true,
        trim: true,
        default: 'https://uploads-ssl.webflow.com/61a28d6eb99ae95aeba70985/61f0188a3b2f466600bb5772_ag3.png'
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Admin'
    }
},{
    timestamps: true
})

let Devotion = mongoose.model('devotions', devotionSchema)

module.exports = Devotion