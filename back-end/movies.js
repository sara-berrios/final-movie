const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const users = require("./users.js");
const multer = require('multer')

const User = users.model;
const validUser = users.valid;

// This is the schema for a movie
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

// Configure multer so that it will upload to '../front-end/public/images'
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 10000000
  }
});

router.post('/photos', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

// Create a new movie: takes a title and a path to an image.
router.post('/', async (req, res) => {
  if (req.user.role !== "admin") {
    return res.sendStatus(403);
  }
  else{
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
  }
});

//gets all the movies in collection
router.get('/', async (req, res) => {
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
router.get('/available', async (req, res) => {
  try {
    let movies = await Movie.find( {user:null} );
    res.send(movies);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// get all movies that have current user
router.get('/checked-out/:userID', async (req, res) => {
  try {
    let user = await User.findOne({
      _id: req.params.userID
    });
    if(!user){
      res.send(404);
      return;
    }else{
      // console.log("checking out");
      // console.log(user);
      let movies = await Movie.find({
        user: user._id
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
router.get('/:id', async (req, res) => {
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
router.put(':movieID/checkout/:userID', async (req, res) => {
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
router.put('/:movieID/return/', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
  if (req.user.role !== "admin") {
    return res.sendStatus(403);
  }
  else{
    try {
      await Movie.deleteOne({
        _id: req.params.id
      });
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
});

//edit one movie
router.put('/:id', validUser, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.sendStatus(403);
  }
  else{
    if (!req.body.title || !req.body.path || !req.body.mpa ||
      !req.body.genre || !req.body.imdb || !req.body.summary) {
      return res.status(400).send({
        message: "All fields are required"
      });
    }
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
  }
});

module.exports = {
  routes: router
}
