
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    //minlength: 5,
   // maxlength: 50
  }
  
  ,lastName: {
    type: String,
   // minlength: 5,
   // maxlength: 50
  },

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
  sessions: [{
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: String,
        required: true
    }
}],
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
  const refreshToken = jwt.sign({ _id: this._id, userRole: this.userRole }, process.env.REFRESH_TOKEN_SECRET,  { expiresIn: '10d' });
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
      let expiresAt = generateRefreshTokenExpiryTime();
      user.sessions.push({ 'token': refreshToken, expiresAt });
      const newUser = await user.save();
      return newUser;
}

let generateRefreshTokenExpiryTime = () => {
  let daysUntilExpire = "10";
  let secondsUntilExpire = ((daysUntilExpire * 24) * 60) * 60;
  return ((Date.now() / 1000) + secondsUntilExpire);
}

const User = mongoose.model('User', UserSchema);

exports.User = User; 
