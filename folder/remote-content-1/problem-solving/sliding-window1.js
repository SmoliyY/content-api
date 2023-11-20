const assert = require("assert");

/**
    Given an array of integers and a number,
    write a function called maxSubarraySum, 
    which finds the maximum sum of a subarray
    with the length of the number passed to the function.

    Note that a subarray must consist of consecutive elements from the original array. 
    In the first example below, [100, 200, 300] is a subarray of the original array, but [100, 300] is not.
 */

function maxSubarraySum(sortedArray, arrayLength) {
  if (sortedArray.length < arrayLength) return null;

  let tmpValue = 0;

  for (let j = 0; j < arrayLength; j++) {
    tmpValue = tmpValue + sortedArray[j];
  }

  let max = tmpValue;

  for (let i = 0; i + arrayLength < sortedArray.length + 1; i++) {
    let beginOfSubarray = sortedArray[i];
    let endOfSubuarray = sortedArray[i + arrayLength];

    tmpValue = tmpValue - beginOfSubarray + endOfSubuarray;

    if (max < tmpValue) {
      max = tmpValue;
    }
  }

  return max;
  // add whatever parameters you deem necessary - good luck!
}

assert.equal(maxSubarraySum([100, 200, 300, 400], 2), 700); // 700
assert.equal(maxSubarraySum([1, 4, 2, 10, 23, 3, 1, 0, 20], 4), 39); // 39
assert.equal(maxSubarraySum([-3, 4, 0, -2, 6, -1], 2), 5); // 5
assert.equal(maxSubarraySum([3, -2, 7, -4, 1, -1, 4, -2, 1], 2), 5); // 5
assert.equal(maxSubarraySum([2, 3], 3), null); // null
