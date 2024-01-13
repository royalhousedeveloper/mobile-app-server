let express = require('express')
require('../db/connection')
let router = express.Router()
let Giving = require('../model/giving')
const auth = require('../middleware/auth')

router.post('/api/v1/giving', auth, async(req, res) => {
    try{
        let giving = new Giving({
            ...req.body,
            admin: req.admin._id,
        })
        await giving.save()
        res.status(201).send(giving)
    }catch(error){
        res.status(400).send(error)
    }
})

router.get('/api/v1/giving', async(req, res) => {
    try{
        let giving = await Giving.find({})
        if(!giving){
            return res.status(404).send()
        }
        res.send(giving)
    }catch(error){
        res.status(500).send()
    }
})

router.patch('/api/v1/giving/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'description', 'paymentUrl']

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidOperation) {
        res.status(400).json({ 'Error': 'Invalide Update.' })
    }

    try {
        const _id = req.params.id
        const giving = await Giving.findOne({ _id})
        if (!giving) {
            return res.status(404).json()
        }
        updates.forEach((update) => {
            giving[update] = req.body[update]
        })
        await giving.save()
        res.json(giving)
    } catch (e) {
        res.status(400).json(e)
    }
})

router.delete('/api/v1/giving/:id', auth, async(req, res) => {
    try {
        const _id = req.params.id
        const giving = await Giving.findOneAndDelete({ _id})
        if (!giving) {
            return res.status(404).send()
        }
        res.send(giving)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router