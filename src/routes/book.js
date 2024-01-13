let express = require('express')
require('../db/connection')
let router = express.Router()
let Book = require('../model/book')
const auth = require('../middleware/auth')


router.post('/api/v1/books', auth, async(req, res) => {
    try{
        let book = new Book({
            ...req.body,
            admin: req.admin._id,
        })
        await book.save()
        res.status(201).send(book)
    }catch(error){
        res.status(400).send(error)
    }
})

router.get('/api/v1/books', async(req, res) => {
    try{
        let book = await Book.find({})
        if(!book){
            return res.status(404).send()
        }
        res.send(book)
    }catch(error){
        res.status(500).send({message: error})
    }
})

//Update 
router.patch('/api/v1/books/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'description', 'authors', 'storeUri']

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidOperation) {
        res.status(400).json({ 'Error': 'Invalide Update.' })
    }

    try {
        const _id = req.params.id
        console.log(_id)
        const book = await Book.findOne({ _id})
        console.log(book)
        if (!book) {
            return res.status(404).json()
        }
        updates.forEach((update) => {
            book[update] = req.body[update]
        })
        await book.save()
        res.json(book)
    } catch (e) {
        res.status(400).json(e)
    }
})

//Delete event
router.delete('/api/v1/books/:id', auth, async(req, res) => {
    try {
        const _id = req.params.id
        const book = await Book.findOneAndDelete({ _id,})
        if (!book) {
            return res.status(404).send()
        }
        res.send(book)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router