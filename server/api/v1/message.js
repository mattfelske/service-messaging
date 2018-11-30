// External dependencies.
const express = require('express');
const router = express.Router();

const ENDPOINTS = require('./endpoints/message');

module.exports = () => {

  router.get('/', (req, res) => {
    ENDPOINTS['get-message'](req, res);
  });

  router.post('/', (req, res) => {
    ENDPOINTS['post-message'](req, res);
  });

  router.put('/', (req, res) => {
    ENDPOINTS['put-message'](req, res);
  });

  router.delete('/', (req, res) => {
    ENDPOINTS['delete-message'](req, res);
  });

  return router;
};
