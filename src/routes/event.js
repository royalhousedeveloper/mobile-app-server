let express = require('express')
require('../db/connection')
let router = express.Router()
let Event = require('../model/event')
const auth = require('../middleware/auth')

router.post('/api/v1/events', auth, async(req, res) => {
    try{
        let event = new Event({
            ...req.body,
            admin: req.admin._id,
        })
        await event.save()
        res.status(201).send(event)
    }catch(error){
        res.status(400).send(error)
    }
})

router.get('/api/v1/events', async(req, res) => {
    try{
        let event = await Event.find({})
        if(!event){
            return res.status(404).send()
        }
        res.send(event)
    }catch(error){
        res.status(500).send()
    }
})

//Update event
router.patch('/api/v1/events/:id', auth, async(req, res) => {
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
        console.log(_id)
        const event = await Event.findOne({ _id})
        console.log(event)
        if (!event) {
            return res.status(404).json()
        }
        updates.forEach((update) => {
            event[update] = req.body[update]
        })
        await event.save()
        res.json(event)
    } catch (e) {
        res.status(400).json(e)
    }
})

//Delete event
router.delete('/api/v1/events/:id', auth, async(req, res) => {
    try {
        const _id = req.params.id
        const event = await Event.findOneAndDelete({ _id: _id,})
        if (!event) {
            return res.status(404).send()
        }
        res.send(event)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router