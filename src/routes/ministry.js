let express = require('express')
require('../db/connection')
let router = express.Router()
let Ministry = require('../model/ministry')
const auth = require('../middleware/auth')

router.post('/api/v1/ministries', auth, async(req, res) => {
    try{
        let ministry = new Ministry({
            ...req.body,
            admin: req.admin._id,
        })
        await ministry.save()
        res.status(201).send(ministry)
    }catch(error){
        res.status(400).send(error)
    }
})

router.get('/api/v1/ministries', async(req, res) => {
    try{
        let ministry = await Ministry.find({})
        if(!ministry){
            return res.status(404).send()
        }
        res.send(ministry)
    }catch(error){
        res.status(500).send()
    }
})

router.patch('/api/v1/ministries/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'contact']

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidOperation) {
        res.status(400).json({ 'Error': 'Invalide Update.' })
    }

    try {
        const _id = req.params.id
        const ministries = await Ministry.findOne({ _id})
        if (!ministries) {
            return res.status(404).json()
        }
        updates.forEach((update) => {
            ministries[update] = req.body[update]
        })
        await ministries.save()
        res.json(ministries)
    } catch (e) {
        res.status(400).json(e)
    }
})

router.delete('/api/v1/ministries/:id', auth, async(req, res) => {
    try {
        const _id = req.params.id
        const ministries = await Ministry.findOneAndDelete({ _id})
        if (!ministries) {
            return res.status(404).send()
        }
        res.send(ministries)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router