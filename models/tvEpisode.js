


const Joi = require('joi');
const mongoose = require('mongoose');

const tvEpisodes = new mongoose.Schema({
    tvShowName: {
        type: String,
        required: true
    },

    tvShowId: {
      type: String,
      required: true
    },

    tvShowPoster: {
      type: String,
      required: true
    },

    tvShowSeason: {
      type: String,
      required: true
    },
   
    tvShowReleaseDate: {
      type: String,
      required: true
    },

    tvEpisodeNum: {
      type: String,
      required: true
    },

    tvEpisodeLanguage: {
      type: String,
      required: true
    },
    tvEpisodeUrl: {
      type: String,
      required: true,
    },
  
    tvEpisodeContry: {
    type: String,
    required: true,
    } ,
    createdAt:  {
      type: String,
      required: true,
    },
    updatedAt:  {
      type: String,
     // required: true,
    },
   
});

const TvEpisodes = mongoose.model('TvEpisodes', tvEpisodes);

function validateTvEpisodes(tvEpisode) {
  console.log(tvEpisode);
    const schema = Joi.object(
  {
    tvShowName: Joi.string().required(),
    tvShowId: Joi.string().required(),
    tvShowPoster: Joi.string().required(),
    tvShowSeason: Joi.string().required(),
    tvShowReleaseDate: Joi.string().required(),
    tvEpisodeUrl: Joi.string().required(),
    tvEpisodeNum: Joi.string().required(),
    tvEpisodeLanguage: Joi.string().required(),
    tvEpisodeContry: Joi.string().required(),
    createdAt: Joi.string().required(),
    updatedAt: Joi.string().allow(''),
  });

  return schema.validate(tvEpisode);
}

exports.tvEpisodes = tvEpisodes;
exports.TvEpisodes = TvEpisodes; 
exports.validate = validateTvEpisodes;