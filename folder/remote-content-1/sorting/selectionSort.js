function swap(array, startIndex, endIndex) {
  const tmpValue = array[startIndex];
  array[startIndex] = array[endIndex];
  array[endIndex] = tmpValue;
}

function selectionSort(arrayToSort) {
  for (let i = 0; i < arrayToSort.length; i++) {
    let minIndex = i;

    for (let j = i + 1; j < arrayToSort.length; j++) {
      if (arrayToSort[j] < arrayToSort[minIndex]) {
        minIndex = j;
      }
    }
    // Prevent swaps
    if (i !== minIndex) {
      swap(arrayToSort, i, minIndex);
    }
  }
  return arrayToSort;
}

const result = selectionSort([0, 0, 3, 11, 9, 22, 5, 3, 6, 10, 88]);
console.log(result);
