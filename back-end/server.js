
const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/checkout-movie', {
  useNewUrlParser: true
});

// Configure multer so that it will upload to '../front-end/public/images'
const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 10000000
  }
});

// Create a scheme for movies: a title and a path to an image.
const movieSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  title: String,
  path: String,
  mpa: String,
  genre: String,
  imdb: Number,
  summary: String,
});

/* API ENDPOINTS FOR MOVIE */

// Create a model for movies
const Movie = mongoose.model('Movie', movieSchema);

app.post('/api/photos', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

// Create a new movie: takes a title and a path to an image.
app.post('/api/movies', async (req, res) => {
  const movie = new Movie({
    title: req.body.title,
    path: req.body.path,
    mpa: req.body.mpa,
    genre: req.body.genre,
    imdb: req.body.imdb,
    summary: req.body.summary,
    user: null,
  });
  try {
    await movie.save();
    res.send(movie);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//gets all the movies in collection
app.get('/api/movies', async (req, res) => {
  try {
    let movies = await Movie.find();
    console.log(movies);
    res.send(movies);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// get all movies that have null user
app.get('/api/movies/available', async (req, res) => {
  try {
    let movies = await Movie.find( {user:null} );
    res.send(movies);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// get all movies that have current user
app.get('/api/movies/checked-out/:userID', async (req, res) => {
  try {
    let currentUser = await User.findOne({
      _id: req.params.userID
    });
    if(!currentUser){
      res.send(404);
      return;
    }else{
      // console.log("checking out");
      // console.log(currentUser);
      let movies = await Movie.find({
        user: currentUser._id
      }).populate('user');
      // console.log(movies);
      res.send(movies);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//gets one movie
app.get('/api/movies/:id', async (req, res) => {
  try {
    let movie = await Movie.findOne({
      _id: req.params.id
    });
    res.send(movie);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//checkout one movie
app.put('/api/movies/:movieID/checkout/:userID', async (req, res) => {
  try{
    let movie = await Movie.findOne({_id:req.params.movieID});
    if (!movie) {
      res.send(404);
      return;
    }else{
      let user = await User.findOne({_id: req.params.userID});
      movie.user = user;
      await movie.save();
      res.send(movie);
      console.log(movie);
    }
  }catch(error){
    console.log(error);
    res.sendStatus(500);
  }
});

//return one movie
app.put('/api/movies/:movieID/return/', async (req, res) => {
  try{
    let movie = await Movie.findOne({_id:req.params.movieID});
    if (!movie) {
      res.send(404);
      return;
    }else{
      movie.user = null;
      await movie.save();
      res.send(movie);
      console.log(movie);
    }
  }catch(error){
    console.log(error);
    res.sendStatus(500);
  }
});

//delete one movie
app.delete('/api/movies/:id', async (req, res) => {
  try {
    await Movie.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//edit one movie
app.put('/api/movies/:id', async (req, res) => {
  try {
    movie = await Movie.findOne({
      _id: req.params.id
    });
    movie.title = req.body.title;
    movie.path = req.body.path;
    movie.mpa = req.body.mpa;
    movie.genre = req.body.genre;
    movie.imdb = req.body.imdb;
    movie.summary = req.body.summary;
    await movie.save();
    res.send(movie);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  email: String,
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


app.listen(3002, () => console.log('Server listening on port 3002!'));
