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
  email: String,
  role: {
    type: String,
    default: ""
    }
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

  // This is a method that we can call on User objects to compare the hash of the
  // password the browser sends with the has of the user's true password stored in
  // the database.
  userSchema.methods.comparePassword = async function(password) {
    try {
      // note that we supply the hash stored in the database (first argument) and
      // the plaintext password. argon2 will do the hashing and salting and
      // comparison for us.
      const isMatch = await argon2.verify(this.password, password);
      return isMatch;
    } catch (error) {
      return false;
    }
  };

  // This is a method that will be called automatically any time we convert a user
  // object to JSON. It deletes the password hash from the object. This ensures
  // that we never send password hashes over our API, to avoid giving away
  // anything to an attacker.
  userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
  }

const User = mongoose.model('User', userSchema);

/* API Endpoints */

/* All of these endpoints start with "/" here, but will be configured by the
   module that imports this one to use a complete path, such as "/api/user" */

// Create a user (signup)
// router.post('/api/users', async (req, res) => {
router.post('/', async (req, res) => {
  if(!req.body.username || !req.body.password ||
    !req.body.firstName || !req.body.lastName ||
    !req.body.email){
    return res.status(400).send({
      message: "all fields are required"
    });
  }
try{
  const existingUser = await User.findOne({
    username: req.body.username
  });
  if(existingUser){
    return res.status(403).send({
      message: "username already exists"
    });
  }
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });
  await user.save;
  // send back a 200 OK response, along with the user that was created
  return res.send({
    user: user
  });
}catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get all users...DO WE NEED THIS?
// app.get('/api/users', async (req, res) => {
//   try {
//     let user = await User.find();
//     res.send(user);
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// });

// login a user
// app.post('/api/users/login', async (req, res) => {
router.post('/login', async (req, res) => {
  // Make sure that the form coming from the browser includes a username and a
  // password, otherwise return an error.
  if (!req.body.username || !req.body.password)
    return res.sendStatus(400);

  try {
    //  lookup user record
    const user = await User.findOne({
      username: req.body.username
    });
    // Return an error if user does not exist.
    if (!user)
      return res.status(403).send({
        message: "username or password is wrong"
      });

    // Return the SAME error if the password is wrong. This ensure we don't
    // leak any information about which users exist.
    if (!await user.comparePassword(req.body.password))
      return res.status(403).send({
        message: "username or password is wrong"
      });

    return res.send({
      user: user
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// logout
// router.delete("/", validUser, async (req, res) => {
  router.delete("/", async (req, res) => {

  try {
    req.session = null;
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = {
  routes: router,
  model: User
};
