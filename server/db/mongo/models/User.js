const { Schema } = require('mongoose');

var userSchema = Schema({
  name: { type: String, default: '', trim: true }
}, {
  collection: 'users',
  timestamps: {
    createdAt: 'dateCreated',
    updatedAt: 'lastUpdated'
  }
});

module.exports = userSchema;
