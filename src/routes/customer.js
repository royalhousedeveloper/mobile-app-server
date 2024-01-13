const express = require('express')
const router = express.Router()
const Customer = require('../model/customer')
const auth = require('../middleware/auth')

//Create customer
router.post('/api/v1/ug/msc/weekends/group-one/ug-bank/customers', async(req, res) => {
    try {
        const customer = new Customer(req.body)
        await customer.save()
        const token = await customer.generateAuthToken()
        res.status(201).send({ customer, token })
    } catch (e) {
        res.status(400).send({message: e})
    }
})


//Get all customers
router.get('/api/v1/ug/msc/weekends/group-one/ug-bank/customers', async(req, res) => {
    try {
        const customer = await Customer.find({})
        res.send(customer)
    } catch (e) {
        res.status(500).send(e)
    }
})

//Get all customers
router.get('/api/v1/auth/ug/msc/weekends/group-one/ug-bank/customers', auth, async(req, res) => {
    try {
        const customer = await Customer.find({})
        res.send(customer)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router