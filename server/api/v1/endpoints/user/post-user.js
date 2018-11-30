var CM = require('../../../../db/mongo').ConnectionManager;
const Utility = require('../../../../plugins/utilities');

module.exports = (req, res) => {

  const BODY = req.body;

  var newUser = CM.connection.models.User();
  newUser.name = BODY.name || '';
  newUser.save((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Error occured creating message' });
    }

    res.status(201).json(newUser);
  });
};
