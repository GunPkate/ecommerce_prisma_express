const express = require('express');
const app = express.Router();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

app.post('/create', async (req,res)=>{
    try {
        const result = await prisma.product.create({
            data: req.body
        })

        res.send({ result: result })
    } catch (e) {
        res.status(500).send({ error: e.message})
    }
})

app.post('/update', async (req,res)=>{
    try {
        const result = await prisma.product.update({
            data: req.body,
            where: {
                id: parseInt(req.body.id) 
            }
        })

        res.send({ message: "success" })
    } catch (e) {
        res.status(500).send({ error: e.message})
    }
})

app.get('/list', async (req,res)=>{
    try {
        const result = await prisma.product.findMany({
          orderBy: { id: 'desc'},
          where: { status: 'use' }
        })

        res.send({ result: result })
    } catch (e) {
        res.status(500).send({ error: e.message})
    }
})

app.delete('/remove/:id', async (req,res) => {
    try {
        await prisma.product.update({
            data: {
                status: 'delete'
            },
            where: {
                id: parseInt(req.params.id)
            }
        })

        res.send({ message: 'success' })
    } catch (e) {
        res.status(500).send({ error: e.message})
    }
})

module.exports = app;