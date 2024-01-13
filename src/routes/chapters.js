let express = require('express')
require('../db/connection')
let router = express.Router()
let Chapter = require('../model/chapters')
const auth = require('../middleware/auth')

router.post('/api/v1/chapters', auth, async(req, res) => {
    try{
        let chapter = new Chapter({
            ...req.body,
            admin: req.admin._id,
        })
        await chapter.save()
        res.status(201).send(chapter)
    }catch(error){
        res.status(400).send(error)
    }
})

router.get('/api/v1/chapters', async(req, res) => {
    try{
        let chapter = await Chapter.find({})
        if(!chapter){
            return res.status(404).send()
        }
        res.send(chapter)
    }catch(error){
        res.status(500).send()
    }
})

//Update event
router.patch('/api/v1/chapters/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name']

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidOperation) {
        res.status(400).json({ 'Error': 'Invalide Update.' })
    }

    try {
        const _id = req.params.id
        const chapter = await Chapter.findOne({ _id})
        if (!chapter) {
            return res.status(404).json()
        }
        updates.forEach((update) => {
            chapter[update] = req.body[update]
        })
        await chapter.save()
        res.json(chapter)
    } catch (e) {
        res.status(400).json(e)
    }
})

//Delete event
router.delete('/api/v1/chapters/:id', auth, async(req, res) => {
    try {
        const _id = req.params.id
        const chapter = await Chapter.findOneAndDelete({ _id,})
        if (!chapter) {
            return res.status(404).send()
        }
        res.send(chapter)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router