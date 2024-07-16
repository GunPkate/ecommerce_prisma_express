const express = require('express');
const app = express.Router();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');


app.post('/signIn',async (req,res) =>{
    try {
        res.send({ message: 'ok'})
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

module.exports = app;