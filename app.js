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

//Config JSON response
app.use(express.json());

//Models
const User = require('./models/User');

//Register Route
app.post('/register', async (req, res) => {

 const { 
  username, 
  email, 
  password, 
  confirmPassword 
 } = req.body;

 if(!username){
  return res.status(400).json({ msg: 'Username is required' });
 }else if(!email){
  return res.status(400).json({ msg: 'Email is required' });
 }else if(!password){
  return res.status(400).json({ msg: 'Password is required' });
 }else if(!confirmPassword){
  return res.status(400).json({ msg: 'You must confirm your password!' });
 }

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
