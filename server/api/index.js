// External dependencies.
const path     = require('path');
const express  = require('express');
const router   = express.Router();
const APP_CONFIG = require('../../config')

// Internal dependencies.
module.exports = function(locals) {

  // Get the route dependencies.
  const API_V1 = require('./v1')(locals);

  router.get('/', (req, res, next) => {
    res.sendFile(path.join(global.fileServeRoot, 'index.html'));
  });
  
  router.get('/hc', (req, res, next) => {
    res.status(200).end();
  });

  router.get('/config', (req, res, next) => {
    // TODO return configuration information about the service
    res.status(200).json(APP_CONFIG.application);
  });

  // Use the versions of the API that are being supported.
  router.use('/v1', API_V1);

  return router;
};
