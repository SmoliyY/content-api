const assert = require("assert");

/**
    Write a function called power which accepts a base and an exponent. 
    The function should return the power of the base to the exponent. 
    This function should mimic the functionality of Math.pow()  - 
    do not worry about negative bases and exponents.
*/

function power(input, powerBy) {
  if (powerBy === 0) return 1;
  return input * power(input, powerBy - 1);
}

assert.equal(power(2, 0), 1);
assert.equal(power(2, 4), 16);
assert.equal(power(3, 3), 27);
