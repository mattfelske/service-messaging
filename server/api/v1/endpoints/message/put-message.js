const async = require('async');

var CM = require('../../../../db/mongo').ConnectionManager;
const Utility = require('../../../../plugins/utilities');

module.exports = (req, res) => {
  if (!req.body) {
    console.error('Missing request body');
    return res.status(400).json({ msg: 'Missing request body' });
  }
  
  var MESSAGE_ID = req.query.id;
  
  if (!MESSAGE_ID) {
    console.error('Missing message request parameter');
    return res.status(400).json({ msg: 'Missing message request parameter' });
  } else {
    MESSAGE_ID = Utility.castToObjectId(MESSAGE_ID);
    if (!MESSAGE_ID) {
      console.error(`Invalid message object id [${req.query.id}]`);
      return res.status(400).json({ msg: `Invalid message object id [${req.query.id}]` });
    }
  }

  let query = { _id: MESSAGE_ID };
  let update = { $set: {} };
  let json = {};

  if (req.body.text !== undefined) json.text = req.body.text;
  
  if (Object.keys(json).length === 0) {
    console.error('No Updates Required');
    return res.status(400).json({ msg: 'No updates required' });
  }
  
  CM.connection.models.Message.findOneAndUpdate(query, update, { new: true }, (err, updatedMessage) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Error occured while updating the message' });
    }
    if (!updatedMessage) {
      console.error('Missing updated message');
      return res.status(500).json({ msg: 'Missing updated message' });
    }
    res.status(200).json(updatedMessage);
  });
};
