export class Utils {

  // typescript implementation of bubble sort
  bubblesort_perm_array(arr: any): any {
    for (let i=0; i<arr.length; i++) {
      for (let j=0; j<(arr.length-1-i); j++) {
        if (arr[j]['permission-level'] > arr[j+1]['permission-level']) {
          let normal = arr[j];
          arr[j] = arr[j + 1];
          arr[j+1] = normal;
        }
      }
    }
    return arr;
  }
}
