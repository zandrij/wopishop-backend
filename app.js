const express = require('express');
const { query, param } = require('express-validator');
const { activeAccount } = require('./src/controllers/auth-controller');
const validateField = require('./src/middlewares/field-validate');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", require("./src/routes/routes"));
app.use("/api/auth", require("./src/routes/user-routes"));

app.use("/active-account/:token", [
    param('token', 'invalid token')
    .isString()
    .isLength({ min:25, max: 25 }),
    validateField
] , activeAccount);

app.get('/', (req, res) => {
    res.send('wopishop actived.');
});

app.listen(port, () => {
    console.log('server actived');
});