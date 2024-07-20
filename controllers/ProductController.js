const express = require('express');
const app = express.Router();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
const fileUpload = require('express-fileupload')
const excelJs = require('exceljs')

app.use(fileUpload());

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

app.post('/upload', async (req,res) => {
    try {

        if(req.files !== undefined){
            const img = req.files.img;
            const fs = require('fs');
            const myDate = new Date();
            const y = myDate.getFullYear()
            const m = myDate.getMonth() + 1;
            const d = myDate.getDate();
            const h = myDate.getHours();
            const mi = myDate.getMinutes();
            const s = myDate.getSeconds();
            const ms = myDate.getMilliseconds();
            const arrFileName = img.name.split('.');
            const ext = arrFileName[arrFileName.length - 1]

            const newName =`${y}${m}${d}${h}${mi}${s}${ms}.${ext}`
            img.mv('./uploads/' + newName, (err) => { 
               if(err) throw err;
               
            })

            res.send({ newName: newName})
        }
    } catch (e) {
        res.status(500).send({ error: e.message})
    }
})

app.post('/uploadExcel', async (req,res) => {
    try {

        if(req.files !== undefined){
            const fileExcel = req.files.fileExcel;

            fileExcel.mv('./uploads/' + fileExcel.name, async (err) => { 
                if(err) throw err;
                    const workbook = new excelJs.Workbook()
                    await workbook.xlsx.readFile('./uploads/' + fileExcel.name);
                    const ws = workbook.getWorksheet(1);
                
                    for(let i = 2; i <= ws.rowCount; i++){
                        const row = ws.getRow(i);
                        const name = row.getCell(1).value ??  '';
                        const price = row.getCell(2).value ??  0;
                        const cost = row.getCell(3).value ??  0;
                        console.log(name,price,cost)

                        if(name != '' && cost >= 0 && price >= 0){

                            await prisma.product.create({
                                data:{
                                    name: name,
                                    price: price,
                                    cost: cost,
                                    img: ''
                                }
                            })
                        }
                    }

                    const fs = require('fs');
                    await fs.unlinkSync('./uploads/' + fileExcel.name);


                res.send({ message: 'success'})
            })

        }
    } catch (e) {
        res.status(500).send({ error: e.message})
    }
})


module.exports = app;