let mongoose = require('mongoose')

let ministrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    contact: {
        type: String,
        required: false,
        trim: true
    },
    description: {
        type: String,
        required: false,
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

let Ministry = mongoose.model('ministries', ministrySchema)

module.exports = Ministry