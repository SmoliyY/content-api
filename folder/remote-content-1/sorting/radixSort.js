function getDigit(number, i) {
  return Math.floor(Math.abs(number) / Math.pow(10, i)) % 10;
}

function digitCount(number) {
  if (number === 0) return 1;
  return Math.floor(Math.log10(Math.abs(number))) + 1;
}

function mostDigits(arr) {
  let maxDigits = 0;
  for (i = 0; i < arr.length; i++) {
    maxDigits = Math.max(maxDigits, digitCount(arr[i]));
  }

  return maxDigits;
}

function radixSort(arr) {
  const maxDigit = mostDigits(arr);

  for (k = 0; k <= maxDigit; k++) {
    let bucket = [];
    for (i = 0; i < arr.length; i++) {
      const digit = getDigit(arr[i], k);
      bucket[digit] = bucket[digit] ? [...bucket[digit], arr[i]] : [arr[i]];
    }
    arr = bucket.flat(1);
  }

  return arr;
}

console.log(radixSort([4, 5512521, 331, 412, 55, 589, 8, 2, 14, 662, 1111]));
console.log(radixSort([0, 0, 3, 11, 87, 22, 5, 3, 6, 10, 88]))
