let express = require('express')
require('../db/connection')
let router = express.Router()
let Gallery = require('../model/gallery')
const auth = require('../middleware/auth')

router.post('/api/v1/gallery', auth, async(req, res) => {
    try{
        let gallery = new Gallery({
            ...req.body,
            admin: req.admin._id,
        })
        await gallery.save()
        res.status(201).send(gallery)
    }catch(error){
        res.status(400).send(error)
    }
})

router.get('/api/v1/gallery', async(req, res) => {
    try{
        let gallery = await Gallery.find({})
        if(!gallery){
            return res.status(404).send()
        }
        res.send(gallery)
    }catch(error){
        res.status(500).send()
    }
})

router.patch('/api/v1/gallery/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['caption']

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidOperation) {
        res.status(400).json({ 'Error': 'Invalide Update.' })
    }

    try {
        const _id = req.params.id
        const gallery = await Gallery.findOne({ _id})
        if (!gallery) {
            return res.status(404).json()
        }
        updates.forEach((update) => {
            gallery[update] = req.body[update]
        })
        await gallery.save()
        res.json(gallery)
    } catch (e) {
        res.status(400).json(e)
    }
})

router.delete('/api/v1/gallery/:id', auth, async(req, res) => {
    try {
        const _id = req.params.id
        const gallery = await Gallery.findOneAndDelete({ _id})
        if (!gallery) {
            return res.status(404).send()
        }
        res.send(gallery)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router