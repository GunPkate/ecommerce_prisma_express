const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors())
const userController = require('./controllers/UserController')

app.use('/user',userController);

app.listen(3001)