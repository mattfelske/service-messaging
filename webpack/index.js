'use strict';

// Load the Application configuration
const APP_CONFIG = require('../config');
if (!APP_CONFIG) {
  console.error(new Error('Unable to load the application configuration')); // eslint-disable-line
  return process.exit();
}

// Load the environment specific webpack object and exports
const WEBPACK_CONFIG = require(`./${APP_CONFIG.env}.js`);

module.exports = WEBPACK_CONFIG;
