const assert = require("assert");

/**
  Write a function called sameFrequency. 
  Given two positive integers, 
  find out if the two numbers have the same frequency of digits.
*/

function sameFrequency(number1, number2) {
  const stringifyNumber1 = number1.toString();
  const stringifyNumber2 = number2.toString();

  if (stringifyNumber2.length !== stringifyNumber1.length) return false;

  let frequencyOfNumber1 = {};
  let frequencyOfNumber2 = {};

  for (const key of stringifyNumber1) {
    frequencyOfNumber1[key] = frequencyOfNumber1[key]
      ? frequencyOfNumber1[key] + 1
      : 1;
  }

  for (const key of stringifyNumber2) {
    frequencyOfNumber2[key] = frequencyOfNumber2[key]
      ? frequencyOfNumber2[key] + 1
      : 1;
  }

  for (const key of stringifyNumber2) {
    if (frequencyOfNumber1[key] !== frequencyOfNumber2[key]) {
      return false;
    }
  }

  return true;

  // good luck. Add any arguments you deem necessary.
}

assert.equal(sameFrequency(182, 281), true);
assert.equal(sameFrequency(34, 14), false);
assert.equal(sameFrequency(3589578, 5879385), true);
assert.equal(sameFrequency(22, 222), false);
