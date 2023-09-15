function merge(array1, array2) {
  let i = 0;
  let j = 0;
  const arrayToReturn = [];

  while (i < array1.length && j < array2.length) {
    if (array1[i] < array2[j]) {
      arrayToReturn.push(array1[i]);
      i++;
    } else {
      arrayToReturn.push(array2[j]);
      j++;
    }
  }

  // Add rest if something left in one of array
  if (i === array1.length) {
    arrayToReturn.push(...array2.slice(j, array2.length));
  } else {
    arrayToReturn.push(...array1.slice(i, array1.length));
  }

  return arrayToReturn;
}

function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  let mid = Math.floor(arr.length / 2);

  let left = mergeSort(arr.slice(0, mid));
  let right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

const result = mergeSort([0, 0, 3, 11, 9, 22, 5, 3, 6, 10, 88]);
console.log(result);
