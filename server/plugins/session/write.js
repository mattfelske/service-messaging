// External dependencies.
const cookie       = require('cookie');
const cookieParser = require('cookie-parser');
const redis        = require('redis');

// Internal dependencies.
const APP_CONFIG   = require('../../../config');

/**
 * Write data to the content part of a given redis session.
 *
 * NOTE: At this time it will completely overwrite the content of the 'data' property.
 *
 * @param {Object}   req      - The http request object
 * @param {String}   content  - The content to be added to the session
 * @param {Function} callback - (optional) The callback function
 * @return {undefined}
 */
module.exports = (req, content, callback) => {
  if (typeof callback !== 'function') {
    callback = () => {};
  }
  if (content === null || content === undefined) {
    return callback(new Error('Missing content parameter'));
  }

  if (req === null || req === undefined) {
    return callback(new Error('Missing or invalid http request object'));
  }

  var cookies   = cookie.parse(req.headers.cookie);
  var sessionID = cookieParser.signedCookie(cookies['connect.sid'], APP_CONFIG.authentication.session.secret);
  var client    = redis.createClient({ 'host': APP_CONFIG.redis.domain, 'port': APP_CONFIG.redis.port });

  client.on('error', (err) => {
    console.error(err);
    client.quit();
    return callback(err);
  });

  client.get(`sess:${sessionID}`, (err, oneSession) => {
    if (err) {
      console.error(err);
      client.quit();
      return callback(err);
    }

    if (!oneSession) {
      console.error('Unable to find session for the given session id', `sess:${sessionID}`);
      client.quit();
      return callback(null, null);
    }

    var newObj = JSON.parse(oneSession);
    if (newObj.data === undefined) {
      newObj.data = {};
    }

    var keys = Object.keys(content);
    for (let i = 0; i < keys.length; i++) {
      var key = keys[i];
      newObj.data[key] = content[key];
    }

    client.set('sess:' + sessionID, JSON.stringify(newObj), (err, result) => {
      if (err) {
        client.quit();
        callback(err);
      } else {
        client.quit();
        callback(null);
      }
    });
  });
};
