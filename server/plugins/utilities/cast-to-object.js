var ObjectId = require('mongoose').Types.ObjectId;

/**
 * Converts a string paramater to a mongodb ObjectId.
 * @param  {String}   id - The string form of an object id.
 * @return {ObjectID} Returns an ObjectID or null if error occurs.
 */
module.exports = (id) => {
  if (typeof id === 'string') {
    try {
      return ObjectId(id);
    } catch (err) {
      console.error(err);
      return null;
    }
  } else if (typeof id === 'object') {
    return id;
  } else {
    console.error(new Error(`Invalid id type [${typeof id}]`));
    return null;
  }
};
