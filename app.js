//imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

const port = 8080;

//Config JSON response
app.use(express.json());

//Models
const User = require('./models/User');

//Public Route
app.get('/', (req, res) => {
 res.status(200).json({ msg: 'Port OK' });
});

//Private Route
app.get('/user/:id', async (req, res) => {
 const id = req.params.id;

 //check if user exists
 const user = await User.findById(id, '-password');

 if (!user){
  return res.status(404).json({ msg: 'User not found!' });
 }

 return res.status(200).json({ msg: `User found: `, user });
});

function checkToken(req, res, next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(!token){
    return res.status(401).json({message: 'You are not authorized!'});
  }

  try {
    const secret = process.env.JWT_SECRET;
    jwt.verify(token, secret);
    next();
  } catch (error) {
    res.status(400).json({message: 'Invalid token!'});
  }
}

//Register Route
app.post('/register', async (req, res) => {

 const { 
  username, 
  email, 
  password, 
  confirmPassword 
 } = req.body;

 if(!username){
  return res.status(422).json({ msg: 'Username is required' });
 }
  if(!email){
  return res.status(422).json({ msg: 'Email is required' });
 }
 if(!password){
  return res.status(422).json({ msg: 'Password is required' });
 }
  if(!confirmPassword){
  return res.status(422).json({ msg: 'You must confirm your password!' });
 }
 if(password !== confirmPassword){
  return res.status(422).json({ msg: 'Password does not match!' });
 }

//check if user exists
const userExists = await User.findOne({ username: username });

if(userExists) {
 return res.status(200).json({ msg: 'User already exists! Create a new username!' });
}

 //check if user email exists
 const userEmailExists = await User.findOne({ email: email });

 if(userEmailExists){
  return res.status(422).json({ msg: 'User already exists! Try another email!' });
 }

 //create password
 const salt = await bcrypt.genSalt(12);
 const hashedPassword = await bcrypt.hash(password, salt);

 //create user
 const user = new User({
  username,
  email,
  password: hashedPassword,
 });

 try {
  await user.save();
  res.status(201).json('User created successfully!');
 } catch (error) {
  return res.status(500).json({ msg: 'Internal server error' });
 }
});

//Login User
app.post('/login', async (req, res) => {
 const { email, password } = req.body;

 if (!email) {
  return res.status(422).json({ msg: 'Email is required' });
 }
 if (!password) {
  return res.status(422).json({ msg: 'Password is required' });
 }

 //check if user exists
 const user = await User.findOne({ email: email});

 if (!user) {
  return res.status(404).json({ msg: 'User not found' });
 }

 //check if password is correct
 const isMatch = await bcrypt.compare(password, user.password);

 if (!isMatch) {
  return res.status(400).json({ msg: 'Invalid password' });
 }

 try {
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign({ 
    id: user._id 
  }, 
    secret
  );
  res.status(200).json({ msg: 'User logged in successfully!', token});

 } catch (err) {
  res.status(500).json({msg: 'Cannot login user! Try again later!'});
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