/* eslint-disable */

var assert = require('assert');

var isPalindrome = require('../../server/plugins/utilities/is-palindrome');

describe('Utilities', function() {
  describe('#isPalindrome', function() {
    it('"kayak" should be true', function() {
      assert.equal(isPalindrome('kayak'), true);
    });
    it('"Race car" should be true', function() {
      assert.equal(isPalindrome('Race car'), true);
    });
    it('"race,ecar" should be true', function() {
      assert.equal(isPalindrome('race,ecar'), true);
    });
    it('"a man, a plan, a canal, panama" should be true', function() {
      assert.equal(isPalindrome('a man, a plan, a canal, panama'), true);
    });
    it('"good stuff" should be false', function() {
      assert.equal(isPalindrome('good stuff'), false);
    });
    it('"luke, i am your father" should be false', function() {
      assert.equal(isPalindrome('luke, i am your father'), false);
    });
  });
  describe('#castToObjectId', function() {
    it('should return ObjectId if string is valid');
    it('should return null if not string ');
    it('should return null if string is not string representation of an ID');
  });
});
