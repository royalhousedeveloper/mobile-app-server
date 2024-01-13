let express = require('express')
require('../db/connection')
let router = express.Router()
let Document = require('../model/document')
const auth = require('../middleware/auth')

router.post('/api/v1/documents', auth, async(req, res) => {
    try{
        let document = new Document({
            ...req.body,
            admin: req.admin._id,
        })
        await document.save()
        res.status(201).send(document)
    }catch(error){
        res.status(400).send(error)
    }
})

router.get('/api/v1/documents', async(req, res) => {
    try{
        let document = await Document.find({})
        if(!document){
            return res.status(404).send()
        }
        res.send(document)
    }catch(error){
        res.status(500).send()
    }
})

router.patch('/api/v1/documents/:id', auth, async(req, res) => {
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
        const document = await Document.findOne({ _id})
        if (!document) {
            return res.status(404).json()
        }
        updates.forEach((update) => {
            document[update] = req.body[update]
        })
        await document.save()
        res.json(document)
    } catch (e) {
        res.status(400).json(e)
    }
})

router.delete('/api/v1/documents/:id', auth, async(req, res) => {
    try {
        const _id = req.params.id
        const document = await Document.findOneAndDelete({ _id})
        if (!document) {
            return res.status(404).send()
        }
        res.send(document)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router