let express = require('express')
require('../db/connection')
let router = express.Router()
let Sermon = require('../model/sermon')
const auth = require('../middleware/auth')

router.post('/api/v1/sermon', auth, async(req, res) => {
    try{
        let sermon = new Sermon({
            ...req.body,
            admin: req.admin._id,
        })
        await sermon.save()
        res.status(201).send(sermon)
    }catch(error){
        res.status(400).send(error)
    }
})

router.get('/api/v1/sermon', async(req, res) => {
    try{
        let sermon = await Sermon.find({})
        if(!sermon){
            return res.status(404).send()
        }
        res.send(sermon)
    }catch(error){
        res.status(500).send()
    }
})

router.patch('/api/v1/sermon/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['caption', 'mediaUri', 'description']

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidOperation) {
        res.status(400).json({ 'Error': 'Invalide Update.' })
    }

    try {
        const _id = req.params.id
        const sermon = await Sermon.findOne({ _id})
        if (!sermon) {
            return res.status(404).json()
        }
        updates.forEach((update) => {
            sermon[update] = req.body[update]
        })
        await sermon.save()
        res.json(sermon)
    } catch (e) {
        res.status(400).json(e)
    }
})

router.delete('/api/v1/sermon/:id', auth, async(req, res) => {
    try {
        const _id = req.params.id
        const sermon = await Sermon.findOneAndDelete({ _id})
        if (!sermon) {
            return res.status(404).send()
        }
        res.send(sermon)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router