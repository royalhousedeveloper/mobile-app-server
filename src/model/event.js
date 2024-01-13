let mongoose = require('mongoose')

let eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
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
        default: 'https://yellowpagesghana.com/wp-content/uploads/2021/10/Royalhouse-Chapel-International.png'
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Admin'
    }
},{
    timestamps: true
})

let Event = mongoose.model('events', eventSchema)

module.exports = Event