//imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

const port = 8080;

//Open Route
app.get('/', (req, res) => {
 res.status(200).json({ msg: 'Port OK' });
});

// MongoDB connection
const DB_NAME = process.env.DB_NAME;

mongoose
  .connect(DB_NAME, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected!');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));
