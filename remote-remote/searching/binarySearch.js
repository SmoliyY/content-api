/**
  Write a function called binarySearch which accepts a 
  sorted array and a value and returns the index at which the value exists. 
  Otherwise, return -1;
 */

const assert = require("assert");

function binarySearch(sortedArray, value) {
  let startPointer = 0;
  let endPointer = sortedArray.length - 1;

  let middlePointer = Math.round(endPointer / 2);

  while (startPointer < endPointer) {
    if (sortedArray[middlePointer] === value) {
      return middlePointer;
    }

    if (sortedArray[middlePointer] > value) {
      endPointer = middlePointer;
    } else {
      startPointer = middlePointer;
    }
    middlePointer = Math.round((endPointer + startPointer) / 2);
  }

  return -1;
  // add whatever parameters you deem necessary - good luck!
}

assert.equal(binarySearch([1, 2, 3, 4, 5], 2), 1);
assert.equal(binarySearch([1, 2, 3, 4, 5], 3), 2);
assert.equal(binarySearch([1, 2, 3, 4, 5], 5), 4);
assert.equal(binarySearch([1, 2, 3, 4, 5], 6), -1);
assert.equal(
  binarySearch(
    [
      5, 6, 10, 13, 14, 18, 30, 34, 35, 37, 40, 44, 64, 79, 84, 86, 95, 96, 98,
      99,
    ],
    10
  ),
  2
);
assert.equal(
  binarySearch(
    [
      5, 6, 10, 13, 14, 18, 30, 34, 35, 37, 40, 44, 64, 79, 84, 86, 95, 96, 98,
      99,
    ],
    95
  ),
  16
);
assert.equal(
  binarySearch(
    [
      5, 6, 10, 13, 14, 18, 30, 34, 35, 37, 40, 44, 64, 79, 84, 86, 95, 96, 98,
      99,
    ],
    100
  ),
  -1
);
