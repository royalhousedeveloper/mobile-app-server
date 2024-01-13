let express = require('express')
require('../db/connection')
let router = express.Router()
let Store = require('../model/store')
const auth = require('../middleware/auth')


router.post('/api/v1/store', auth, async(req, res) => {
    try{
        let store = new Store({
            ...req.body,
            admin: req.admin._id,
        })
        await store.save()
        res.status(201).send(store)
    }catch(error){
        res.status(400).send(error)
    }
})

router.get('/api/v1/store', async(req, res) => {
    try{
        let store = await Store.find({})
        if(!store){
            return res.status(404).send()
        }
        res.send(store)
    }catch(error){
        res.status(500).send({message: error})
    }
})

//Update 
router.patch('/api/v1/store/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'description', 'free', 'storeUri']

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidOperation) {
        res.status(400).json({ 'Error': 'Invalide Update.' })
    }

    try {
        const _id = req.params.id
        console.log(_id)
        const store = await Store.findOne({ _id})
        console.log(store)
        if (!store) {
            return res.status(404).json()
        }
        updates.forEach((update) => {
            store[update] = req.body[update]
        })
        await store.save()
        res.json(store)
    } catch (e) {
        res.status(400).json(e)
    }
})

//Delete event
router.delete('/api/v1/store/:id', auth, async(req, res) => {
    try {
        const _id = req.params.id
        const store = await Store.findOneAndDelete({ _id,})
        if (!store) {
            return res.status(404).send()
        }
        res.send(store)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router