let express = require('express')
require('../db/connection')
let router = express.Router()
let Devotion = require('../model/devotion')
const auth = require('../middleware/auth')

router.post('/api/v1/devotions', auth, async(req, res) => {
    try{
        let devotion = new Devotion({
            ...req.body,
            admin: req.admin._id,
        })
        await devotion.save()
        res.status(201).send(devotion)
    }catch(error){
        res.status(400).send(error)
    }
})

router.get('/api/v1/devotions', async(req, res) => {
    try{
        let devotion = await Devotion.find({})
        if(!devotion){
            return res.status(404).send()
        }
        res.send(devotion)
    }catch(error){
        res.status(500).send()
    }
})

router.patch('/api/v1/devotions/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'description', 'date']

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidOperation) {
        res.status(400).json({ 'Error': 'Invalide Update.' })
    }

    try {
        const _id = req.params.id
        console.log(_id)
        const devotion = await Devotion.findOne({ _id})
        console.log(devotion)
        if (!devotion) {
            return res.status(404).json()
        }
        updates.forEach((update) => {
            devotion[update] = req.body[update]
        })
        await devotion.save()
        res.json(devotion)
    } catch (e) {
        res.status(400).json(e)
    }
})

router.delete('/api/v1/devotions/:id', auth, async(req, res) => {
    try {
        const _id = req.params.id
        const devotion = await Devotion.findOneAndDelete({ _id,})
        if (!devotion) {
            return res.status(404).send()
        }
        res.send(devotion)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router