
const mongoose = require('mongoose');


const TVShow = mongoose.model('TvShows', new mongoose.Schema({
  tvShowName: {
        type: String,
        required: true
    },
    tvShowGenres: { 
      type: [String],  
      required: true
    },
    tvShowLanguage: {
      type: String,
      required: true,
      trim: true, 
      minlength: 5,
      maxlength: 255
    },
    tvShowContry: {
      type: String,
      required: true,
      trim: true, 
    },
    tvShowSeason: {
        type: String,
        required: true,
        min: 1,
      },
      tvShowReleaseDate: { 
        type: String,  
        required: true
      },
      tvShowEpisodes: {
        type: String,
        required: true,
        min: 1,
      },
  tvShowPoster: {
    type: String,
    required: true,
  },
  createdAt:  {
    type: String,
    required: true,
  },
  updatedAt:  {
    type: String,
   // required: true,
  },

}));


exports.TvShow = TVShow; 
