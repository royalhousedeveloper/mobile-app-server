let mongoose = require('mongoose')

let givingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true, 
        unique: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    paymentUrl: {
        trim: true,
        type: String,
        required: true,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Admin'
    }
},{
    timestamps: true
})

let Giving = mongoose.model('giving', givingSchema)

module.exports = Giving