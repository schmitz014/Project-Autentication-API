//imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

const port = 8080;

app.get('/', (req, res) => {
 res.status(200).json({ msg: 'Port OK' });
})

app.listen(port);