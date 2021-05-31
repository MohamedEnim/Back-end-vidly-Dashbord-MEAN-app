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

router.get('/', auth, async (req, res) => {
  const movies = await Movie.find().sort('movieReleaseDate');
  res.send(movies);
});

/**** Trending ****/
router.get('/trending', async (req, res) => {
  const movies = await Movie.find({ movieTrending: true }).sort('movieName');
  res.send(movies);
});


router.post('/',  multer({ storage: storage }).single("image"), async (req, res) => {
  
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

router.put('/:id',  multer({ storage: storage }).single("image"), async (req, res) => {
 
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

router.put('/samePoster/:id', async (req, res) => {
  
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

router.delete('/:id', async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie) return res.status(404).send('The movie with the given ID was not found.');

  res.send(movie);
});

router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.status(404).send('The movie with the given ID was not found.');

  res.send(movie);
});

/*router.get('/genre/:name', async (req, res) => {
  const genreName = req.params.name;
  const movie = await Movie.find({movieGenres: genreName});

  if (!movie) return res.status(404).send('The movie with the given ID was not found.');

  res.send(movie);
});*/

/**MOBILE API GET movie by name */
router.get('/selectMovie/:name', async (req, res) => {
const name = req.params.name;
const movie = await Movie.find({ movieName :{ $regex: new RegExp('.*' + name + '.*'), $options: 'i' } } );

  if (!movie) return res.status(404).send('The movie with the given name was not found.');
  res.send(movie);
});





module.exports = router; 