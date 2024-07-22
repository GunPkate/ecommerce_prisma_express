const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors())
app.use('/uploads',express.static('uploads'))
const userController = require('./controllers/UserController')
const productController = require('./controllers/ProductController')
const saleController = require('./controllers/SaleController')

app.use('/user',userController);
app.use('/product',productController);
app.use('/sale',saleController);

app.listen(3001)