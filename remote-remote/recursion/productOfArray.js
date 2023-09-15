const assert = require("assert");

/**
    Write a function called productOfArray 
    which takes in an array of numbers and returns the product of them all.
*/

function productOfArray(numArray) {
  if (numArray.length === 0) return 1;

  return numArray[0] * productOfArray(numArray.slice(1));
}

assert.equal(productOfArray([1, 2, 3]), 6);
assert.equal(productOfArray([1, 2, 3, 10]), 60);
