const Joi = require('joi');
const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    refreshToken: {
    type: String,
    required: true,
  }
});

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

function validateRefreshToken(refreshToken) {
    const schema = Joi.object(
  {
    refreshToken: Joi.string().required()
  });

  return schema.validate(refreshToken);
}

exports.RefreshToken = RefreshToken; 
exports.validate = validateRefreshToken;