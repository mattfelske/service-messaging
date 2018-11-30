// External dependencies.
const express  = require('express');
const router   = express.Router();

// Internal dependencies.\
const ROUTER_MESSAGE = require('./message');
const ROUTER_USER = require('./user');

module.exports = () => {

  router.get('/', (req, res, next) => {
    res.status(403).json({ msg: 'The API route is not authorized' });
  });

  router.use('/message', ROUTER_MESSAGE());
  router.use('/user', ROUTER_USER());

  return router;
};
