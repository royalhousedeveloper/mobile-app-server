let express = require('express')
require('../db/connection')
let router = express.Router()
let Message = require('../model/message')
const auth = require('../middleware/auth')

router.post('/api/v1/messages', auth, async(req, res) => {
    try{
        let message = new Message({
            ...req.body,
            admin: req.admin._id,
        })
        await message.save()
        res.status(201).send(message)
    }catch(error){
        res.status(400).send(error)
    }
})

router.get('/api/v1/messages', async(req, res) => {
    try{
        let message = await Message.find({})
        if(!message){
            return res.status(404).send()
        }
        res.send(message)
    }catch(error){
        res.status(500).send()
    }
})

router.patch('/api/v1/messages/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'description', 'author', 'date']

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidOperation) {
        res.status(400).json({ 'Error': 'Invalide Update.' })
    }

    try {
        const _id = req.params.id
        const message = await Message.findOne({ _id})
        if (!message) {
            return res.status(404).json()
        }
        updates.forEach((update) => {
            message[update] = req.body[update]
        })
        await message.save()
        res.json(message)
    } catch (e) {
        res.status(400).json(e)
    }
})

router.delete('/api/v1/messages/:id', auth, async(req, res) => {
    try {
        const _id = req.params.id
        const message = await Message.findOneAndDelete({ _id})
        if (!message) {
            return res.status(404).send()
        }
        res.send(message)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router