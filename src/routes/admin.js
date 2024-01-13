const express = require('express')
const router = express.Router()
const Admin = require('../model/admin')
const auth = require('../middleware/auth')

//Create admin
router.post('/api/v1/accounts/admins', async(req, res) => {
    try {
        const admin = new Admin(req.body)
        await admin.save()
        const token = await admin.generateAuthToken()
        res.status(201).send({ admin, token })
    } catch (e) {
        res.status(400).send({message: e})
    }
})

//User login
router.post('/api/v1/accounts/admins/login', async(req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.email, req.body.password)
        const token = await admin.generateAuthToken()
        res.send({ admin, token })
    } catch (e) {
        res.status(400).send({message: e})
    }
})

//User details
router.get('/api/v1/accounts/admins/me', auth, async(req, res) => {
    try {
        await res.send(req.admin)
    } catch (e) {
        res.status(400).send({message: e})
    }
})


//Reading all users
router.get('/api/v1/accounts/admins/all', auth, async(req, res) => {
    try {
        const admin = await User.find({})
        res.send(admin)
    } catch (e) {
        res.status(500).send(e)
    }
})


//Logout user
router.post('/api/v1/accounts/admins/logout', auth, async(req, res) => {
    try {
        req.admin.tokens = req.admin.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.admin.save()
        res.send()
    } catch (e) {
        res.status(500).send({message: e})
    }
})


//Logout from all account
router.post('/api/v1/accounts/admins/logoutAll', auth, async(req, res) => {
    try {
        req.admin.tokens = []
        await req.admin.save()
        res.send()
    } catch (e) {
        res.status(500).send({message: e})
    }
})

//Update user profile
router.patch('/api/v1/accounts/admins/me', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'password']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidOperation) {
        return res.status(400).send({ 'message': 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => {
            req.admin[update] = req.body[update]
        })
        await req.admin.save()

        res.send(req.admin)
    } catch (e) {
        res.status(400).send({message: e})
    }
})


//Delete user
router.delete('/api/v1/accounts/admins/me', auth, async(req, res) => {
    try {
        await req.admin.remove()
        res.send(req.admin)
    } catch (e) {
        res.status(500).send({message: e})
    }
})

//Delete admin profile
router.delete('/api/v1/accounts/admins/me', auth, async(req, res) => {
    try {
        req.admin.avatar = undefined
        await req.admin.save()
        res.send()
    } catch (e) {
        res.status(404).send({message: e})
    }
})

module.exports = router