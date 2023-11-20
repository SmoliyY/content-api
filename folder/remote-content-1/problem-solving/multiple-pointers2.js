const assert = require("assert");

/**
   Write a function called averagePair.
   Given a sorted array of integers and a target average, 
   determine if there is a pair of values in the array 
   where the average of the pair equals the target average. 
   There may be more than one pair that matches the average target.
 */

function averagePair(sortedArray, average) {
  if (sortedArray.length === 0) return false;

  let iPointer = 0;
  let jPointer = sortedArray.length - 1;

  while (iPointer < sortedArray.length) {
    let currentSum = (sortedArray[iPointer] + sortedArray[jPointer]) / 2;
    if (currentSum === average) return true;
    if (currentSum < average) {
      iPointer++;
    } else {
      jPointer--;
    }
  }

  return false;
  // add whatever parameters you deem necessary - good luck!
}

assert.equal(averagePair([1,2,3],2.5), true);
assert.equal(averagePair([1,3,3,5,6,7,10,12,19],8), true);
assert.equal(averagePair([-1,0,3,4,5,6], 4.1),false);
assert.equal(averagePair([]), false);
