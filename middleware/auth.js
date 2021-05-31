const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
   const authHeader = req.header('x-access-token');
 
   const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; 
    next();
  }
  catch (ex) {
    res.status(401).send('Invalid token.');
  }
}

