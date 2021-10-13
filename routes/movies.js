const {Movie, validate} = require('../models/movie'); 
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const multer = require("multer");
const express = require('express');
const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "./images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

/**
 * GET /api/movies
 * Purpose: Get all Movies
 */
router.get('/', auth, async (req, res) => {
  const movies = await Movie.find().sort('movieReleaseDate');
  res.send(movies);
});

/**
 * GET /api/movies/trending
 * Purpose: Get all Trending Movies
 */
router.get('/trending', auth, async (req, res) => {
  const movies = await Movie.find({ movieTrending: true }).sort('movieName');
  res.send(movies);
});

/**
 * POST /api/movies
 * Purpose: Create a Movie
 */

router.post('/', auth, multer({ storage: storage }).single("image"), async (req, res) => {
  
  const url = req.protocol + "://" + req.get("host");

  let movie = new Movie({ 
    movieName: req.body.movieName,
    movieGenres:  req.body.movieGenres,
    movieLanguage: req.body.movieLanguage,
    movieContry: req.body.movieContry,
    movieUrl: req.body.movieUrl,
    movieReleaseDate: req.body.movieReleaseDate,
    duration: req.body.duration,
    descriptionEN: req.body.descriptionEN,
    descriptionAR: req.body.descriptionAR,
    movieTrending: req.body.movieTrending,
    moviePoster: url + "/images/" + req.file.filename,
    createAt: req.body.createAt,
    updateAt: req.body.updateAt
  });
  movie = await movie.save();
  
  res.send(movie);
});

/**
 * PUT /api/movies/:id
 * Purpose: Update a Movie with new poster
 */

router.put('/:id', auth, multer({ storage: storage }).single("image"), async (req, res) => {
 
  const url = req.protocol + "://" + req.get("host");

  const movie = await Movie.findByIdAndUpdate(req.params.id,
    { 
      movieName: req.body.movieName,
    movieGenres:  req.body.movieGenres,
    movieLanguage: req.body.movieLanguage,
    movieContry: req.body.movieContry,
    movieUrl: req.body.movieUrl,
    movieReleaseDate: req.body.movieReleaseDate,
    duration: req.body.duration,
    descriptionEN: req.body.descriptionEN,
    descriptionAR: req.body.descriptionAR,
    movieTrending: req.body.movieTrending,
    moviePoster: url + "/images/" + req.file.filename,
    createAt: req.body.createAt,
    updateAt: req.body.updateAt
    }, { new: true });

  if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  
  res.send(movie);
});

/**
 * PUT /api/movies/samePoster/:id
 * Purpose: Update a Movie with the same  poster
 */

router.put('/samePoster/:id', auth, async (req, res) => {
  
  const movie = await Movie.findByIdAndUpdate(req.params.id,
    { 
      movieName: req.body.movieName,
    movieGenres:  req.body.movieGenres,
    movieLanguage: req.body.movieLanguage,
    movieContry: req.body.movieContry,
    movieUrl: req.body.movieUrl,
    movieReleaseDate: req.body.movieReleaseDate,
    duration: req.body.duration,
    descriptionEN: req.body.descriptionEN,
    descriptionAR: req.body.descriptionAR,
    movieTrending: req.body.movieTrending,
    moviePoster: req.body.moviePoster,
    createAt: req.body.createAt,
    updateAt: req.body.updateAt
    }, { new: true });

  if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  
  res.send(movie);
});

/**
 * DELETE /api/movies/:id
 * Purpose: Delete a Movie
 */

router.delete('/:id', auth, async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie) return res.status(404).send('The movie with the given ID was not found.');

  res.send(movie);
});

/**
 * GET /api/movies/:id
 * Purpose: Get One Movie with id
 */

router.get('/:id', auth, async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.status(404).send('The movie with the given ID was not found.');

  res.send(movie);
});

/**
 * MOBILE API
 * GET /api/movies/selectMovie/:name
 * Purpose: Get Movie with name
 */

router.get('/selectMovie/:name', async (req, res) => {
const name = req.params.name;
const movie = await Movie.find({ movieName :{ $regex: new RegExp('.*' + name + '.*'), $options: 'i' } } );

  if (!movie) return res.status(404).send('The movie with the given name was not found.');
  res.send(movie);
});





module.exports = router; 