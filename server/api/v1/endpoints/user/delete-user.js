var CM = require('../../../../db/mongo').ConnectionManager;
const Utility = require('../../../../plugins/utilities');

module.exports = (req, res) => {
  var USER_ID  = req.query.id;

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
  CM.connection.models.User.findOneAndRemove(query, (err, removedUser) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Error occured while removing the user' });
    }
    if (!removedUser) {
      console.error('Missing removed user');
      return res.status(500).json({ msg: 'Missing removed user' });
    }
    res.status(200).json(removedUser);
  });
};
