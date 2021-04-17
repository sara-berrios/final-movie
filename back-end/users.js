const express = require("express");
const mongoose = require('mongoose');
const argon2 = require("argon2");

const router = express.Router();

//
// User schema and model
//

// This is the schema. Users have usernames and passwords. We solemnly promise to
// salt and hash the password!
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  email: String
});

// This is a hook that will be called before a user record is saved,
// allowing us to be sure to salt and hash the password first.
userSchema.pre('save', async function(next) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password'))
      return next();
  
    try {
      // generate a hash. argon2 does the salting and hashing for us
      const hash = await argon2.hash(this.password);
      // override the plaintext password with the hashed one
      this.password = hash;
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

const User = mongoose.model('User', userSchema);

// Create a user (signup)
app.post('/api/users', async (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  });
  try {
    await user.save();
    res.send(user);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    let user = await User.find();
    res.send(user);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a user
app.post('/api/users/login', async (req, res) => {
  console.log("before try catch");
  try {
    let user = await User.findOne({username: req.body.username, password: req.body.password});
  //  console.log(user);
    if (!user) {
      res.status(403).send("Incorrect username or password");
    }else{
      res.send(user);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});