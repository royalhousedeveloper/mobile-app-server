let mongoose = require('mongoose')

let gallerySchema = new mongoose.Schema({
    caption: {
        type: String,
        required: false,
        trim: true
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

let Gallery = mongoose.model('gallery', gallerySchema)

module.exports = Gallery