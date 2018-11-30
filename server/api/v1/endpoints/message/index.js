/* eslint no-sync:0 */

/**
 * Exports the files (using their filename format) so that they can be accessed directly
 */
var path = require('path');
var fs = require('fs');

fs.readdirSync(__dirname).forEach((file) => {
  if (file === 'index.js') return;
  module.exports[path.basename(file, '.js')] = require(path.join(__dirname, file));
});
