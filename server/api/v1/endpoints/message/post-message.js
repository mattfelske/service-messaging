var CM = require('../../../../db/mongo').ConnectionManager;
const Utility = require('../../../../plugins/utilities');

module.exports = (req, res) => {

  const BODY = req.body;

  // TODO validate the request so that we do proper HTTP status codes.
  if (!BODY.text) {
    console.error('Missing text');
    return res.status(400).json({ msg: 'Missing text parameter' });
  } else {
    if (typeof BODY.text !== 'string') {
      console.error('Invalid string');
      return res.status(400).json({ msg: 'Invalid parameter, expected string' });
    }
  }

  var newMessage = CM.connection.models.Message();
  newMessage.text = BODY.text;
  newMessage.isPalindrome = Utility.isPalindrome(BODY.text);
  newMessage.save((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Error occured creating message' });
    }

    res.status(201).json(newMessage);
  });
};
