function swap(array, startIndex, endIndex) {
  const tmpValue = array[startIndex];
  array[startIndex] = array[endIndex];
  array[endIndex] = tmpValue;
}

function bubbleSort(arrayToSort) {
  let noSwap;
  for (let i = arrayToSort.length - 1; i >= 0; i--) {
    for (let j = 0; j <= i - 1; j++) {
      noSwap = true;
      if (arrayToSort[j] > arrayToSort[j + 1]) {
        swap(arrayToSort, j, j + 1);
        noSwap = false;
      }
    }

    if (noSwap) break;
  }

  return arrayToSort;
}
const result = bubbleSort([0, 0, 3, 11, 9, 22, 5, 6, 10]);
console.log(result);
