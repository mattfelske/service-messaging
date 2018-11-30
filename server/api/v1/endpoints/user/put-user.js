const async = require('async');

var CM = require('../../../../db/mongo').ConnectionManager;
const Utility = require('../../../../plugins/utilities');

module.exports = (req, res) => {
  if (!req.body) {
    console.error('Missing request body');
    return res.status(400).json({ msg: 'Missing request body' });
  }
  
  var USER_ID = req.query.id;
  
  if (!USER_ID) {
    console.error('Missing user request parameter');
    return res.status(400).json({ msg: 'Missing user request parameter' });
  } else {
    USER_ID = Utility.castToObjectId(USER_ID);
    if (!USER_ID) {
      console.error(`Invalid user object id [${req.query.id}]`);
      return res.status(400).json({ msg: `Invalid user object id [${req.query.id}]` });
    }
  }

  let query = { _id: USER_ID };
  let update = { $set: {} };
  let json = {};

  if (req.body.name !== undefined) json.name = req.body.name;
  
  if (Object.keys(json).length === 0) {
    console.error('No Updates Required');
    return res.status(400).json({ msg: 'No updates required' });
  }
  
  CM.connection.models.User.findOneAndUpdate(query, update, { new: true }, (err, updatedUser) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Error occured while updating the message' });
    }
    if (!updatedUser) {
      console.error('Missing updated message');
      return res.status(500).json({ msg: 'Missing updated message' });
    }
    res.status(200).json(updatedUser);
  });
};
