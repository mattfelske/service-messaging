// External dependencies.
const cookie       = require('cookie');
const cookieParser = require('cookie-parser');
const redis        = require('redis');

// Internal dependencies.
const APP_CONFIG   = require('../../../config');


/**
 * Read the redis session information that is attached to a request object and return
 * the content stored in the 'data' part of the object.
 *
 * @param  {Object}    req      - The http request object
 * @param  {Function}  callback - The callback function
 * @return {undefined}
 */
module.exports = (req, callback) => {
  if (!callback || typeof callback !== 'function') {
    return console.error(new Error('Missing or invalid callback function'));
  }
  if (req === null || req === undefined) {
    return callback(new Error('Missing or invalid http request object'));
  }

  var cookies   = cookie.parse(req.headers.cookie);
  var sessionID = cookieParser.signedCookie(cookies['connect.sid'], APP_CONFIG.authentication.session.secret);
  var client    = redis.createClient({ 'host': APP_CONFIG.redis.domain, 'port': APP_CONFIG.redis.port });

  client.on('error', (err) => {
    client.quit();
    return callback(err);
  });

  client.get(`sess:${sessionID}`, (err, oneSession) => {
    if (err) {
      client.quit();
      return callback(err);
    }

    if (!oneSession) {
      console.error('Unable to find session for the given session id', `sess:${sessionID}`);
      client.quit();
      return callback(null, null);
    }

    var newObj = JSON.parse(oneSession);
    var result = newObj.data;
    client.quit();
    callback(null, result);
  });
};
