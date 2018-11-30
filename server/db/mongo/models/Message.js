const { Schema } = require('mongoose');

var messageSchema = Schema({
  text:         { type: String, required: true, trim: true },
  isPalindrome: { type: Boolean, required: true },
  postedBy:     { type: Schema.ObjectId, ref: 'User', required: true }
}, {
  collection: 'messages',
  timestamps: {
    createdAt: 'dateCreated',
    updatedAt: 'lastUpdated'
  }
});

module.exports = messageSchema;
