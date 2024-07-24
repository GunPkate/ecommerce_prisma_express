const express = require('express');
const app = express.Router();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

app.post('/order',async (req,res) => {
    try {
        const resultBillSale = await prisma.billSale.create({
            data: {
                customerName: req.body.customerName,
                customerPhone: req.body.customerPhone,
                address: req.body.address,
                payDate: new Date(req.body.payDate),
                payTime: req.body.payTime
            }
        })

        for (let i = 0; i < req.body.cart.length; i++) {
            let resultProduct = await prisma.product.findFirst({
                where: { id: req.body.cart[i].id }
            })
            await prisma.billSaleDetail.create({
                data: {
                    billSaleId : resultBillSale.id,
                    productId: resultProduct.id,
                    cost: resultProduct.cost,
                    price: resultProduct.price
                }
            })
            // Prevent edit from Client 
        }

        res.send({ message: 'success'})
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

app.get('/order',async (req,res) => {
    try {
        let result = await prisma.billSale.findMany({
            orderBy: { id: 'asc' }
        })
        res.send({ result: result})
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

app.get('/order/:id',async (req,res) => {
    try {
        let result = await prisma.billSaleDetail.findMany({
            include: { Product: true},
            where: {billSaleId: parseInt(req.params.id)},
            orderBy: { id: 'asc' }
        })
        res.send({ result: result})
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

app.get('/orderUpdateStatusPay/:id',async (req,res) => {
    try {
        let result = await prisma.billSale.update({
            data: { status: 'Pay' },
            where: {id: parseInt(req.params.id)},
        })
        res.send({ message: 'success'})
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

app.get('/orderUpdateStatusInTransit/:id',async (req,res) => {
    try {
        let result = await prisma.billSale.update({
            data: { status: 'In Transit' },
            where: {id: parseInt(req.params.id)},
        })
        res.send({ message: 'success'})
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

app.get('/orderUpdateStatusCancel/:id',async (req,res) => {
    try {
        let result = await prisma.billSale.update({
            data: { status: 'Cancel' },
            where: {id: parseInt(req.params.id)},
        })
        res.send({ message: 'success'})
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

module.exports = app;