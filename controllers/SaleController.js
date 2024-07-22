const express = require('express');
const app = express.Router();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

app.post('/order',async (req,res) => {
    try {
        const result = await prisma.billSale.create({
            data: {
                customerName: req.body.customerName,
                customerPhone: req.body.customerPhone,
                address: req.body.address,
                payDate: new Date(req.body.payDate),
                payTime: req.body.payTime
            }
        })
        res.send({ message: 'success'})
        console.log(req.body)
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

module.exports = app;