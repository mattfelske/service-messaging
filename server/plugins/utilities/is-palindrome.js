/**
 * Checks to see if the parameter passed is a palindrome.
 * @param  {String}  text - THe character string to be checked to see if it's a palindrome.
 * @return {Boolean} Returns true is it is palindrome. False otherwise.
 */
module.exports = (text) => {
  var regex = /[^A-Za-z0-9]/g;
  var str = text.toLowerCase().replace(regex, '');

  for (var i = 0; i < str.length/2; i++) {
    if (str[i] !== str[str.length - 1 - i]) {
      return false;
    }
  }
  return true;
};
