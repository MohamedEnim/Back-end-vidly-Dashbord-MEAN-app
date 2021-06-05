const {TvShow, validate} = require('../models/tvShow'); 
const {TvEpisodes} = require('../models/tvEpisode');
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
 * GET /api/tvShows
 * Purpose: Get all TVShows
 */

router.get('/', auth, async (req, res) => {
  const tvShows = await TvShow.find().sort();
  res.send(tvShows);
});

/**
 * POST /api/tvShows
 * Purpose: Create a TVShow
 */

router.post('/', auth,  multer({ storage: storage }).single("image"), async (req, res) => {

 const url = req.protocol + "://" + req.get("host");
  
  let tvShow = new TvShow({ 
    tvShowName: req.body.tvShowName,
    tvShowGenres: req.body.tvShowGenres,
    tvShowLanguage: req.body.tvShowLanguage,
    tvShowContry: req.body.tvShowContry,
    tvShowSeason: req.body.tvShowSeason,
    tvShowReleaseDate: req.body.tvShowReleaseDate,
    tvShowEpisodes: req.body.tvShowEpisodes,
    tvShowPoster: url + "/images/" + req.file.filename,
    createdAt: req.body.createdAt,
    updatedAt: req.body.updatedAt
  });
  tvShow = await tvShow.save();
  
  res.send(tvShow);
});

/**
 * PUT /api/tvShows/:id
 * Purpose: Update a TVShow with a new poster
 */

router.put('/:id' ,  multer({ storage: storage }).single("image"), async (req, res) => {
 
  const url = req.protocol + "://" + req.get("host");

  const tvShow = await TvShow.findByIdAndUpdate(req.params.id,
    { 
      tvShowName:  req.body.tvShowName,
      tvShowGenres:  req.body.tvShowGenres,
      tvShowLanguage: req.body.tvShowLanguage,
      tvShowContry: req.body.tvShowContry,
      tvShowSeason: req.body.tvShowSeason,
      tvShowReleaseDate: req.body.tvShowReleaseDate,
      tvShowEpisodes: req.body.tvShowEpisodes,
      tvShowPoster:  url + "/images/" + req.file.filename,
      createdAt: req.body.createdAt,
      updatedAt: req.body.updatedAt
    }, { new: true });

  if (!tvShow) return res.status(404).send('The tvShow with the given ID was not found.');
  
  const tvEpisode = await TvEpisodes.updateMany({'tvShowId': req.params.id },{
    tvShowName: tvShow.tvShowName,
    tvShowSeason: tvShow.tvShowSeason,
    tvShowReleaseDate: tvShow.tvShowReleaseDate,
    tvEpisodeLanguage: tvShow.tvShowLanguage,
    tvShowGenres: tvShow.tvShowGenres,
    tvShowPoster:  tvShow.tvShowPoster,
    tvEpisodeContry: tvShow.tvShowContry,
   }, { new: true })

  res.send(tvShow);
  
});

/**
 * PUT /api/tvShows/:id
 * Purpose: Update a TVShow with the same  poster
 */

 router.put('/samePoster/:id', async (req, res) => {
  
  const tvShow = await TvShow.findByIdAndUpdate(req.params.id,
    { 
      tvShowName:  req.body.tvShowName,
      tvShowGenres:  req.body.tvShowGenres,
      tvShowLanguage: req.body.tvShowLanguage,
      tvShowContry: req.body.tvShowContry,
      tvShowSeason: req.body.tvShowSeason,
      tvShowReleaseDate: req.body.tvShowReleaseDate,
      tvShowEpisodes: req.body.tvShowEpisodes,
      tvShowPoster: req.body.tvShowPoster,
      createdAt: req.body.createdAt,
      updatedAt: req.body.updatedAt
    }, { new: true });
   
  if (!tvShow) return res.status(404).send('The tvShow with the given ID was not found.');

  const tvEpisode = await TvEpisodes.updateMany({'tvShowId': req.params.id },{
      tvShowName: req.body.tvShowName,
      tvShowSeason: req.body.tvShowSeason,
      tvShowReleaseDate: req.body.tvShowReleaseDate,
      tvShowGenres: req.body.tvShowGenres,
      tvEpisodeLanguage: req.body.tvShowLanguage,
      tvEpisodeContry: req.body.tvShowContry,
     }, { new: true })
   
  res.send(tvShow);
});

/**
 * DELETE /api/tvShows/:id
 * Purpose: Delete a TVShow
 */

router.delete('/:id', async (req, res) => {
 
  const tvShow = await TvShow.findByIdAndRemove(req.params.id);

  if (!tvShow) return res.status(404).send('The TvShow with the given ID was not found.');

  const tvEpisode = await TvEpisodes.deleteMany({'tvShowId': req.params.id})

  res.send(tvShow);
});

/**
 * GET /api/tvShows/:id
 * Purpose: Get One TVShow with id
 */


router.get('/:id', async (req, res) => {
  const tvShow = await TvShow.findById(req.params.id);

  if (!tvShow) return res.status(404).send('The tvShow with the given ID was not found.');

  res.send(tvShow);
});


/**
 * MOBILE API
 * GET /api/tvShows/selectTvShow/:name
 * Purpose: Get TVShow with name
 */

 router.get('/selectTvShow/:name', async (req, res) => {
  const name = req.params.name;
  const tvShow = await TvShow.find({ tvShowName: { $regex: new RegExp('.*' + name + '.*'), $options: 'i' } } );
  
    if (!tvShow) return res.status(404).send('The tvShow with the given name was not found.');
    res.send(tvShow);
  });
  
  

module.exports = router; 