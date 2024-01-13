let mongoose = require('mongoose')

let chapterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        trim: true
    },
    contact: {
        type: String,
        required: true,
        trim: true,
        default: '+233241506299'
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Admin'
    }
},{
    timestamps: true
})

let Chapter = mongoose.model('chapters', chapterSchema)

module.exports = Chapter