var CM = require('../../../../db/mongo').ConnectionManager;
const Utility = require('../../../../plugins/utilities');

module.exports = (req, res) => {
  var MESSAGE_ID  = req.query.id;

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
  CM.connection.models.Message.findOneAndRemove(query, (err, removedMessage) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Error occured while removing the message' });
    }
    if (!removedMessage) {
      console.error('Missing removed message');
      return res.status(500).json({ msg: 'Missing removed message' });
    }
    res.status(200).json(removedMessage);
  });
};
