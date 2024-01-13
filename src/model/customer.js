const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Event = require('./event')

const customerSchema = mongoose.Schema({
    first_name: {
        required: true,
        type: String,
        trim: true
    },
    last_name: {
        required: true,
        type: String,
        trim: true
    },
    other_name: {
        required: false,
        type: String,
        trim: true,
    },
    phone_number: {
        required: true,
        type: String,
        trim: true,
        validate(value) {
            if (value.length < 10) {
                throw new Error('Invalid phone number.')
            }
        }
    },
    date_of_birth: {
        required: true,
        type: String,
        trim: true
    },
    gender: {
        required: true,
        type: String,
        trim: true
    },
    national_id: {
        required: true,
        type: String,
        trim: true
    },
    passport_photo_url: {
        required: true,
        type: String,
        trim: true
    },
    activate: {
        required: true,
        type: String,
        default: true
    },
    email: {
        required: true,
        trim: true,
        type: String,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email.')
            }
        }
    },
    customer_financial_info_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    customer_address_info_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    customer_account_info_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    customer_credit_card_info_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    customer_loan_info_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    password: {
        required: true,
        trim: true,
        type: String,
        minlength: 8,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('password must not contain password.')
            }
        }
    },
    tokens: [{
        token: {
            require: true,
            type: String
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

customerSchema.virtual('books', {
    ref: 'books',
    localField: '_customer_id',
    foreignField: 'admin'
})

customerSchema.methods.toJSON = function() {
    const admin = this
    const adminObject = admin.toObject()

    delete adminObject.password
    delete adminObject.tokens

    return adminObject
}

customerSchema.methods.generateAuthToken = async function() {
    const admin = this
    const token = jwt.sign({ _id: admin._id.toString() }, "process.env.JWT_SECRET")

    admin.tokens = admin.tokens.concat({ token: token })
    await admin.save()
    return token
}


customerSchema.statics.findByCredentials = async(email, password) => {
    const admin = await Admin.findOne({ email })
    if (!admin) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, admin.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return admin
}

//Hashing before saving admin
customerSchema.pre('save', async function(next) {
    const admin = this

    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8)
    }

    next()
})

//Delete events when admin is remove
customerSchema.pre('remove', async function(next) {
    const admin = this
    await Event.deleteMany({ owner: admin._id })

    next()
})


const Customer = new mongoose.model('customer_info', customerSchema)

module.exports = Customer