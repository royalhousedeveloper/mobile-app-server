let express = require('express')
require('../db/connection')
let router = express.Router()
let programRegistration = require('../model/program_registration')
const auth = require('../middleware/auth')


router.post('/api/v1/program-registration', auth, async(req, res) => {
    try{
        let registration = new programRegistration({
            ...req.body,
            admin: req.admin._id,
        })
        await registration.save()
        res.status(201).send(registration)
    }catch(error){
        res.status(400).send(error)
    }
})

router.get('/api/v1/program-registration', async(req, res) => {
    try{
        let registration = await programRegistration.find({})
        if(!registration){
            return res.status(404).send()
        }
        res.send(registration)
    }catch(error){
        res.status(500).send({message: error})
    }
})

router.patch('/api/v1/program-registration/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'location', 'type', 'registrationUri', 'date']

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidOperation) {
        res.status(400).json({ 'Error': 'Invalide Update.' })
    }

    try {
        const _id = req.params.id
        const registration = await programRegistration.findOne({ _id})
        if (!registration) {
            return res.status(404).json()
        }
        updates.forEach((update) => {
            registration[update] = req.body[update]
        })
        await registration.save()
        res.json(registration)
    } catch (e) {
        res.status(400).json(e)
    }
})

router.delete('/api/v1/program-registration/:id', auth, async(req, res) => {
    try {
        const _id = req.params.id
        const registration = await programRegistration.findOneAndDelete({ _id})
        if (!registration) {
            return res.status(404).send()
        }
        res.send(registration)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router