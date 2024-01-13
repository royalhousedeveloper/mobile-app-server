let mongoose = require('mongoose')

let storeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    free: {
        type: Boolean,
        required: true,
        trim: true,
        default: true
    },
    description: {
        type: String,
        required: false,
        trim: true,
        default: ''
    },
    storeUri: {
        type: String,
        required: false,
        trim: true,
        default: ''
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

let Store = mongoose.model('store', storeSchema)

module.exports = Store