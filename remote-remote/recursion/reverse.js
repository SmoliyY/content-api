const assert = require("assert");

/**
 Write a recursive function called reverse which accepts a string and returns a new string in reverse.
 */
function reverse(inputString) {
  var helperArray = [];

  function reverseString(inputString) {
    if (inputString.length === 0) {
      return helperArray.join("");
    }

    helperArray.push(inputString[inputString.length - 1]);

    return reverseString(inputString.slice(0, inputString.length - 1));
  }

  return reverseString(inputString);

  // add whatever parameters you deem necessary - good luck!
}

assert.equal(reverse('tralala'), 'alalart');
assert.equal(reverse('ben'), 'neb');
assert.equal(reverse('yevhen'), 'nehvey')


console.log(22)
