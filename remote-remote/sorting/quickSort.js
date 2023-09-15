function swap(array, startIndex, endIndex) {
  const tmpValue = array[startIndex];
  array[startIndex] = array[endIndex];
  array[endIndex] = tmpValue;
}

// TODO: this is cope paste - figure out how it works
function pivot(arr, start = 0, end = arr.length + 1) {
  let pivot = arr[start];
  let swapIndex = start;

  for (let i = start + 1; i <= end; i++) {
    if (pivot > arr[i]) {
      swapIndex++;
      swap(arr, swapIndex, i);
    }
  }

  swap(arr, start, swapIndex);

  return swapIndex;
}

function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    let pivotIndex = pivot(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }

  return arr;
}

const result = quickSort([0, 0, 3, 11, 87, 22, 5, 3, 6, 10, 88]);
console.log(result);


// TODO TODO TODO
