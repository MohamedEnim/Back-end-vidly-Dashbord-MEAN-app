const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const {RefreshToken} = require('../models/refreshToken');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();



router.post('/token', async (req, res) => {
    
  const refreshToken = req.header('x-refresh-token');
  if (!refreshToken) return res.status(401).send('Access denied. No token provided.');
   
  const body = req.body;

    let user = await User.findById(req.body._id);
    if (!user) return res.status(400).send('Invalid email or password.');
    console.log( refreshToken)
   

   

    try {
       
      const decoded = await jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET);
      console.log(decoded);
      let newUser = _.pick(decoded, ['_id', 'userRole'])
      console.log(newUser);
        const accessToken = user.generateAuthToken();
        
        console.log(accessToken)
        res.header('x-access-token',  `Bearer ${accessToken}`).send({ accessToken });
      }
      catch (ex) {
        console.log("token");
        res.status(400).send('Invalid token.');
      }

});

  router.delete('/logout', (req, res) => {
   // const refreshToken = await RefreshToken.deleteOne({ refreshToken: req.body.token.refreshToken })
  //  if (!refreshToken) return res.status(404).send('The refreshToken with the given ID was not found.');
//res.status(204).send(refreshToken);
  })

router.post('/login', async (req, res) => {
 
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');


  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');


  const refreshToken =  user.createSession();
  const accessToken = user.generateAuthToken();
 // let a = `Bearer ${refreshToken}`;

  console.log(refreshToken);
  res
  .header('x-access-token', `Bearer ${accessToken}`)
  .header('x-refresh-token', refreshToken)
  .send(_.pick(user, ['_id', 'userRole']));


});

router.post('/users', async (req, res) => {
  // User sign up
  let email = req.body.email;
  let password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(req.body.password, salt);

  let newUser = new User({
    firstName: 'mohamed',
    lastName: 'bentaher',
    email: email,
    password: password
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
