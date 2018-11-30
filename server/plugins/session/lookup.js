const CONFIG = {
  domain: 'localhost',
  port:   123
};
const redis = require('redis');

var CM = require('../../db/mongo').ConnectionManager;

module.exports = (sessionID, callback) => {
  if (!callback || typeof callback !== 'function') {
    return console.error(new Error('Missing or invalid callback function'));
  }
  if (sessionID === null || sessionID === undefined) {
    return callback(new Error('Missing sessionID'));
  }
  var client = redis.createClient({ host: CONFIG.domain, port: CONFIG.port });

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
      return callback(new Error(`Unable to find session for the given id [sess:${sessionID}]`));
    }
    client.quit();

    var newObj = JSON.parse(oneSession);
    var userID;
    try {
      userID = newObj.passport.user.id;
    } catch (e) {
      return callback(new Error('Invalid Session'));
    }

    CM.connection.models.User.findById({ _id: userID }, (err, oneUser) => {
      if (err) {
        return callback(err);
      }
      if (!oneUser) {
        return callback(new Error(`Unable to find user for ${userID}`));
      }
      callback(null, oneUser);
    });
  });
};
