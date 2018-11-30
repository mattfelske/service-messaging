var CM = require('../../../../db/mongo').ConnectionManager;
const Utility = require('../../../../plugins/utilities');

module.exports = (req, res) => {

  CM.connection.models.Message.find(req.query, (err, messages) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Error occured retrieving messages' });
    }
    res.status(200).json(messages);
  });


};
