/* eslint no-sync:0 */
/**
 * Exports all files in the folder so they can all be accessed collectively.
 */
var path = require('path');

require('fs').readdirSync(__dirname).forEach((file) => {
  if (file === 'index.js' || file.startsWith('.')) return;

  module.exports[path.basename(file, '.js')] = require(path.join(__dirname, file));
});
