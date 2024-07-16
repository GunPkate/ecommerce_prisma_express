const express = require('express');
const app = express.Router();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

app.post('/signIn',async (req,res) =>{
    try {
        const user = await prisma.user.findFirst({
            select: {
                id: true,
                name: true
            },
            where: {
                user: req.body.user,
                pass: req.body.pass,
                status: 'use'
            }
        })
        if(user != null){
            const secret = process.env.TOKEN_SECRET;
            const token = jwt.sign( user, secret, {expiresIn: '30m'});
            return res.send( { token: token  } );
        }
        res.status(401).send({ message: 'unauthorized' })
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

module.exports = app;