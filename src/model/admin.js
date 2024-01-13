const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Event = require('./event')

const adminSchema = mongoose.Schema({
    name: {
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

adminSchema.virtual('books', {
    ref: 'books',
    localField: '_id',
    foreignField: 'admin'
})

adminSchema.methods.toJSON = function() {
    const admin = this
    const adminObject = admin.toObject()

    delete adminObject.password
    delete adminObject.tokens

    return adminObject
}

adminSchema.methods.generateAuthToken = async function() {
    const admin = this
    const token = jwt.sign({ _id: admin._id.toString() }, process.env.JWT_SECRET)

    admin.tokens = admin.tokens.concat({ token: token })
    await admin.save()
    return token
}


adminSchema.statics.findByCredentials = async(email, password) => {
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
adminSchema.pre('save', async function(next) {
    const admin = this

    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8)
    }

    next()
})

//Delete events when admin is remove
adminSchema.pre('remove', async function(next) {
    const admin = this
    await Event.deleteMany({ owner: admin._id })

    next()
})


const Admin = new mongoose.model('admins', adminSchema)

module.exports = Admin