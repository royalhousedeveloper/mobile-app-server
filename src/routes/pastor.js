let express = require('express')
require('../db/connection')
let router = express.Router()
let Pastor = require('../model/pastor')
const auth = require('../middleware/auth')

router.post('/api/v1/pastor', auth, async(req, res) => {
    try{
        let pastor = new Pastor({
            ...req.body,
            admin: req.admin._id,
        })
        await pastor.save()
        res.status(201).send(pastor)
    }catch(error){
        res.status(400).send(error)
    }
})

router.get('/v1/pastor', async(req, res) => {
    try{
        let pastor = await Pastor.find({})
        if(!pastor){
            return res.status(404).send()
        }
        res.send(pastor)
    }catch(error){
        res.status(500).send()
    }
})

module.exports = router