
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const UserSchema = new mongoose.Schema({

  userPoster: {
    type: String,
  }
  
  ,email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  tokens: [String],
  userRole: {
    type: String,
    enum: ['ADMIN', 'SUPER_ADMIN', 'USER'],
    default: 'USER'
  }
});

UserSchema.methods.generateAuthToken = function() { 
  const accessToken = jwt.sign({ _id: this._id, userRole: this.userRole }, process.env.ACCESS_TOKEN_SECRET,  { expiresIn: '3600s' });
  return accessToken;
}

UserSchema.methods.generateRefreshAuthToken = function () {
  const refreshToken = jwt.sign({ _id: this._id, userRole: this.userRole }, process.env.REFRESH_TOKEN_SECRET,  { expiresIn: '3d' });
  return refreshToken;
}

UserSchema.methods.createSession = function () {
  let user = this;
  const  refreshToken = user.generateRefreshAuthToken();
   saveSessionToDatabase(user, refreshToken);
   return refreshToken; 
}


/* HELPER METHODS */
let saveSessionToDatabase = async (user, refreshToken) => {
      user.tokens.push(refreshToken);
      const newUser = await user.save();
      return newUser;
}



const User = mongoose.model('User', UserSchema);

exports.User = User; 
