let express = require('express')
require('../db/connection')
let router = express.Router()
let Media = require('../model/media')
const auth = require('../middleware/auth')

router.post('/api/v1/media', auth, async(req, res) => {
    try{
        let media = new Media({
            ...req.body,
            admin: req.admin._id,
        })
        await media.save()
        res.status(201).send(media)
    }catch(error){
        res.status(400).send(error)
    }
})

router.get('/api/v1/media', async(req, res) => {
    try{
        let media = await Media.find({})
        if(!media){
            return res.status(404).send()
        }
        res.send(media)
    }catch(error){
        res.status(500).send()
    }
})

router.patch('/api/v1/media/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['caption', 'mediaUri']

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidOperation) {
        res.status(400).json({ 'Error': 'Invalide Update.' })
    }

    try {
        const _id = req.params.id
        const media = await Media.findOne({ _id})
        if (!media) {
            return res.status(404).json()
        }
        updates.forEach((update) => {
            media[update] = req.body[update]
        })
        await media.save()
        res.json(media)
    } catch (e) {
        res.status(400).json(e)
    }
})

router.delete('/api/v1/media/:id', auth, async(req, res) => {
    try {
        const _id = req.params.id
        const media = await Media.findOneAndDelete({ _id})
        if (!media) {
            return res.status(404).send()
        }
        res.send(media)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router