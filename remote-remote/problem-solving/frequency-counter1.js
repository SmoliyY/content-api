const assert = require("assert");

/**
    Given two strings, write a function to determine if the second string is an anagram of the first. 
    An anagram is a word, phrase, or name formed by rearranging the letters of another, 
    such as cinema, formed from iceman.
*/

function validAnagram(text1, text2) {
  if (text1.length !== text2.length) {
    return false;
  }

  const splitT1 = text1.split("");
  const splitT2 = text2.split("");

  const frequencyCounter1 = {};
  const frequencyCounter2 = {};

  for (const letter of splitT1) {
    frequencyCounter1[letter] = frequencyCounter1[letter]
      ? frequencyCounter1[letter] + 1
      : 1;
  }

  for (const letter of splitT2) {
    frequencyCounter2[letter] = frequencyCounter2[letter]
      ? frequencyCounter2[letter] + 1
      : 1;
  }

  for (const keyLetter in frequencyCounter1) {
    if (!frequencyCounter2[keyLetter]) {
      return false;
    }

    if (frequencyCounter2[keyLetter] !== frequencyCounter1[keyLetter]) {
      return false;
    }
  }

  return true;
}

assert.equal(validAnagram("anagram", "nagaram"), true);
assert.equal(validAnagram("", ""), true); // true
assert.equal(validAnagram("aaz", "zza"), false); // false
assert.equal(validAnagram("anagram", "nagaram"), true); // true
assert.equal(validAnagram("rat", "car"), false); // false) // false
assert.equal(validAnagram("awesome", "awesom"), false); // false
assert.equal(
  validAnagram("amanaplanacanalpanama", "acanalmanplanpamana"),
  false
); // false
assert.equal(validAnagram("qwerty", "qeywrt"), true); // true
