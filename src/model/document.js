let mongoose = require('mongoose')

let documentSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: false,
        trim: true
    },
    documentUri: {
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

let Document = mongoose.model('documents', documentSchema)

module.exports = Document