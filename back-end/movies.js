const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const users = require("./users.js");

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

const User = users.model;
const validUser = users.valid;
