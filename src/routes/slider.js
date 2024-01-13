let express = require('express')
require('../db/connection')
let router = express.Router()
let Slider = require('../model/slider')
const auth = require('../middleware/auth')

router.post('/api/v1/sliders', auth, async(req, res) => {
    try{
        let slider = new Slider({
            ...req.body,
            admin: req.admin._id,
        })
        await slider.save()
        res.status(201).send(slider)
    }catch(error){
        res.status(400).send(error)
    }
})

router.get('/api/v1/sliders', async(req, res) => {
    try{
        let slider = await Slider.find({})
        if(!slider){
            return res.status(404).send()
        }
        res.send(slider)
    }catch(error){
        res.status(500).send()
    }
})

router.patch('/api/v1/sliders/:id', auth, async(req, res) => {
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
        const slider = await Slider.findOne({ _id})
        if (!slider) {
            return res.status(404).json()
        }
        updates.forEach((update) => {
            slider[update] = req.body[update]
        })
        await slider.save()
        res.json(slider)
    } catch (e) {
        res.status(400).json(e)
    }
})

router.delete('/api/v1/sliders/:id', auth, async(req, res) => {
    try {
        const _id = req.params.id
        const slider = await Slider.findOneAndDelete({ _id})
        if (!slider) {
            return res.status(404).send()
        }
        res.send(slider)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router