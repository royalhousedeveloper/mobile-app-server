let mongoose = require('mongoose')

let sliderSchema = new mongoose.Schema({
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

let Slider = mongoose.model('sliders', sliderSchema)

module.exports = Slider