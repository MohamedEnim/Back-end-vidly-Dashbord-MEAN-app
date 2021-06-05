

const {TvEpisodes, validate} = require('../models/tvEpisode');
const {TvShow} = require('../models/tvShow'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

/**
 * GET /api/tvEpisodes
 * Purpose: Get all Episodes
 */

router.get('/', async (req, res) => {
  const tvEpisodes = await TvEpisodes.find().sort('tvShowName');
  res.send(tvEpisodes);
});

/**
 * POST /api/tvEpisodes
 * Purpose: Create an Episode to tvShow
 */

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let tvEpisodes = new TvEpisodes({ 
      tvShowName: req.body.tvShowName,
      tvShowId: req.body.tvShowId,
      tvShowPoster: req.body.tvShowPoster,
      tvShowSeason: req.body.tvShowSeason,
      tvShowReleaseDate: req.body.tvShowReleaseDate,
      tvEpisodeUrl: req.body.tvEpisodeUrl,
      tvEpisodeNum: req.body.tvEpisodeNum,
      tvShowGenres:  req.body.tvShowGenres,
      tvEpisodeLanguage: req.body.tvEpisodeLanguage,
      tvEpisodeContry: req.body.tvEpisodeContry,
      createdAt: req.body.createdAt,
      updatedAt: req.body.updatedAt
    });
  tvEpisodes = await tvEpisodes.save();
  
  res.send(tvEpisodes);
});

/**
 * POST /api/tvEpisodes/add
 * Purpose: Add an Episode of tvShow
 */

router.post('/add', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let tvEpisodes = new TvEpisodes({ 
      tvShowName: req.body.tvShowName,
      tvShowId: req.body.tvShowId,
      tvShowPoster: req.body.tvShowPoster,
      tvShowSeason: req.body.tvShowSeason,
      tvShowReleaseDate: req.body.tvShowReleaseDate,
      tvEpisodeUrl: req.body.tvEpisodeUrl,
      tvEpisodeNum: req.body.tvEpisodeNum,
      tvShowGenres:  req.body.tvShowGenres,
      tvEpisodeLanguage: req.body.tvEpisodeLanguage,
      tvEpisodeContry: req.body.tvEpisodeContry,
      createdAt: req.body.createdAt,
      updatedAt: req.body.updatedAt
    });
  tvEpisodes = await tvEpisodes.save();
  
  const tvShow = await  TvShow.findByIdAndUpdate( req.body.tvShowId,
    {    
      tvShowEpisodes: (parseInt(tvShowEpisodes) + 1).toString(),
    }, { new: true });
  res.send(tvEpisodes);
});

/**
 * PUT /api/tvEpisodes/:id
 * Purpose: Update an episode of tvShow
 */

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const tvEpisodes = await TvEpisodes.findByIdAndUpdate(req.params.id, { 
    tvEpisodeUrl: req.body.tvEpisodeUrl}
   , {
    new: true
  });

  if (!tvEpisodes) return res.status(404).send('The tvEpisodes with the given ID was not found.');
  
  res.send(tvEpisodes);
});

/**
 * DELETE /api/tvEpisodes/:tvEpisodeId/:tvShowId
 * Purpose: Delete an Episode
 */

router.delete('/:tvEpisodeId/:tvShowId', async (req, res) => {

      const tvEpisode = await TvEpisodes.findByIdAndRemove(req.params.tvEpisodeId);
    
     if (!tvEpisode) return res.status(404).send('The tvEpisode with the given ID was not found.');

     let tvShow = await  TvShow.findById(req.params.tvShowId);
  
    if(tvShow.tvShowEpisodes > 0){
       tvShow = await  TvShow.findByIdAndUpdate( req.params.tvShowId,
   {    
          tvShowEpisodes: (parseInt(tvShow.tvShowEpisodes)- 1).toString() ,
        }, { new: true });
       return   res.send(tvEpisode);
     
 }else{
     const tvShow = await TvShow.findByIdAndRemove(req.params.tvShowId);
      res.send(tvEpisode);
     }
  
});

/**
 * GET /api/tvEpisodes/:id
 * Purpose: Get One Episode with id
 */

router.get('/:id', async (req, res) => {
  const tvEpisodes = await TvEpisodes.find({'tvShowId': req.params.id});

  if (!tvEpisodes) return res.status(404).send('The tvEpisodes with the given ID was not found.');

  res.send(tvEpisodes);
});

/**
 * GET /api/tvEpisodes/toUpdate/:id
 * Purpose: Get One Episode with id to update
 */

router.get('/toUpdate/:id', async (req, res) => {
  const tvEpisode = await TvEpisodes.findById(req.params.id);

  if (!tvEpisode) return res.status(404).send('The tvEpisodes with the given ID was not found.');

  res.send(tvEpisode);
});



module.exports = router;