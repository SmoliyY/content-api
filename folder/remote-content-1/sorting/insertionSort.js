function insertionSort(arrayToSort) {
  for (let i = 1; i < arrayToSort.length; i++) {
    let currentValue = arrayToSort[i];
    for (var j = i - 1; j >= 0 && arrayToSort[j] > currentValue; j--) {
      arrayToSort[j + 1] = arrayToSort[j];
    }

    arrayToSort[j + 1] = currentValue;
  }

  return arrayToSort;
}

const result = insertionSort([0, 0, 3, 11, 9, 22, 5, 3, 6, 10, 88]);
console.log(result);
