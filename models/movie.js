
const mongoose = require('mongoose');


const Movie = mongoose.model('Movies', new mongoose.Schema({
  movieName: {
    type: String,
    required: true,
    trim: true, 
    minlength: 5,
    maxlength: 255
  },
  movieGenres: { 
    type: [String],  
    required: true
  },
  movieLanguage: {
    type: String,
    required: true,
    trim: true, 
    minlength: 5,
    maxlength: 255
  },
  movieContry: {
    type: String,
    required: true,
    trim: true, 
    minlength: 5,
    maxlength: 255
  },
  movieUrl: {
    type: String,
    required: true,
    trim: true, 
    minlength: 5,
    maxlength: 255
  },
  movieReleaseDate: { 
    type: String,  
    required: true
  },
  duration: { 
    type: String,  
    required: true
  },
  descriptionEN: { 
    type: String,  
  },
  descriptionAR: { 
    type: String,  
  },
  movieTrending: {
    type: Boolean,
    required: true,
  },
  moviePoster: {
    type: String,
    required: true,
  },
  createAt: {
    type: String,
    required: true,
  },
  updateAt: {
    type: String,
  },
 
}));



exports.Movie = Movie; 
