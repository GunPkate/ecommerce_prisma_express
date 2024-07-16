const express = require('express');
const app = express();
const body = require('body-parser');
const cors = require('cors')

app.use(body.json());
app.use(body.urlencoded({ extended: true}));
app.use(cors)
const userController = require('./controllers/UserController')

app.use('/user',userController);

app.listen(3001)