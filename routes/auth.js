const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const {RefreshToken} = require('../models/refreshToken');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

/**
 * POST /api/auth/token
 * Purpose: Get new access Token
 */

router.post('/token', async (req, res) => {
    
  const refreshToken = req.header('x-refresh-token');
  if (!refreshToken) return res.status(401).send('Access denied. No token provided.');
   
  const body = req.body;

    let user = await User.findById(body._id);
    if (!user) return res.status(400).send('Invalid email or password.');
   
    try {
      const decoded = await jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET);
      let newUser = _.pick(decoded, ['_id', 'userRole'])
      const accessToken = user.generateAuthToken();
      res.header('x-access-token',  `Bearer ${accessToken}`).send({ accessToken });
      }
      catch (ex) {
        res.status(400).send('Invalid token.');
      }

});

/**
 * DELETE /api/auth/logout/:userDetails
 * Purpose: Lougout
 */

router.delete('/logout/:userDetails', async (req, res) => {
 
    let refreshToken = req.header('x-refresh-token');
    const userId =  JSON.parse(req.params.userDetails)._id;
    let user = await User.findById(userId);
    if (!user) return res.status(400).send('Invalid email or password.');
    user.tokens = user.tokens.filter(token => token !== refreshToken);
    user = await user.save();
    res.status(200).send(user);
});

/**
 * POST /api/auth/login
 * Purpose: Login and get both access and refresh Token
 */

router.post('/login', async (req, res) => {
 
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');


  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');


  const refreshToken =  user.createSession();
  const accessToken = user.generateAuthToken();
 
  res
  .header('x-access-token', `Bearer ${accessToken}`)
  .header('x-refresh-token', refreshToken)
  .send(_.pick(user, ['_id', 'userRole']));


});

/**
 * POST /api/auth/users
 * Purpose: Sign Up and get both access and refresh Token
 */

router.post('/users', async (req, res) => {
 
  let email = req.body.email;
  let password = req.body.password;
  let userPoster = req.body.poster;
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(req.body.password, salt);

  let newUser = new User({
    userPoster: userPoster,
    email: email,
    password: password,
    userRole: 'ADMIN'
  });

  const user = await newUser.save(); 
  const refreshToken =  user.createSession();
  const accessToken = user.generateAuthToken();
  
  res
  .header('x-refresh-token', refreshToken)
  .header('x-access-token', accessToken)
  .send(user._id);

});

function validate(req) {
  
  const  schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(req);
}



module.exports = router; 
