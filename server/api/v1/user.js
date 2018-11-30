
// External dependencies.
const express = require('express');
const router = express.Router();

const ENDPOINTS = require('./endpoints/user');

module.exports = () => {

  router.get('/', (req, res) => {
    ENDPOINTS['get-user'](req, res);
  });

  router.post('/', (req, res) => {
    ENDPOINTS['post-user'](req, res);
  });

  router.put('/', (req, res) => {
    ENDPOINTS['put-user'](req, res);
  });

  router.delete('/', (req, res) => {
    ENDPOINTS['delete-user'](req, res);
  });

  return router;
};
