let express = require('express')
require('../db/connection')
let router = express.Router()
let Notification = require('../model/notification')
const auth = require('../middleware/auth')


router.post('/api/v1/notifications', auth, async(req, res) => {
    try{
        let notifications = new Notification({
            ...req.body,
            admin: req.admin._id,
        })
        await notifications.save()
        res.status(201).send(notifications)
    }catch(error){
        res.status(400).send(error)
    }
})

router.get('/api/v1/notifications', async(req, res) => {
    try{
        let notification = await Notification.find({})
        if(!notification){
            return res.status(404).send()
        }
        res.send(notification)
    }catch(error){
        res.status(500).send()
    }
})

router.patch('/api/v1/notifications/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'description']

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidOperation) {
        res.status(400).json({ 'Error': 'Invalide Update.' })
    }

    try {
        const _id = req.params.id
        const notification = await Notification.findOne({ _id})
        if (!notification) {
            return res.status(404).json()
        }
        updates.forEach((update) => {
            notification[update] = req.body[update]
        })
        await notification.save()
        res.json(notification)
    } catch (e) {
        res.status(400).json(e)
    }
})

router.delete('/api/v1/notifications/:id', auth, async(req, res) => {
    try {
        const _id = req.params.id
        const notification = await Notification.findOneAndDelete({ _id})
        if (!notification) {
            return res.status(404).send()
        }
        res.send(notification)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router