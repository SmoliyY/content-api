const assert = require("assert");

/**
    Implement a function called countUniqueValues, which accepts a sorted array, 
    and counts the unique values in the array. 
    There can be negative numbers in the array, but it will always be sorted.
 */



function countUniqueValues(sortedArray) {
  if (sortedArray.length === 0) return 0;

  let iPointer = 0;
  let jPointer = 1;

  while (jPointer < sortedArray.length) {
    if (sortedArray[iPointer] !== sortedArray[jPointer]) {
      iPointer++;
      sortedArray[iPointer] = sortedArray[jPointer];
    }

    jPointer++;
  }

  return iPointer + 1;

  // add whatever parameters you deem necessary - good luck!
}


assert.equal(countUniqueValues([1,1,1,1,1,2]), 2)
assert.equal(countUniqueValues([1,2,3,4,4,4,7,7,12,12,13]), 7)
assert.equal(countUniqueValues([]), 0)
assert.equal(countUniqueValues([-2,-1,-1,0,1]), 4)