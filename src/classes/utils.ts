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

  // password validation
  // checks if the password has more than 8 chars
  // has at least 1 special char
  // has at least one number
  validatePassword(pwd: string): any[] {
    let spl = pwd.split('');

    if (spl.length < 8) {
      return [false, 'Your password must have at least 8 characters'];
    }

    const SPECIAL_CHARS: string[] = ['!', '§', '$', ')', '(', '?', '=', '^', '#', '+', '*', '-', '/', ';'];

    let specialCounter = 0;

    for (let i=0; i<spl.length; i++) {
      for (let j=0; j<SPECIAL_CHARS.length; j++) {
        if (spl[i] === SPECIAL_CHARS[j]) { specialCounter++; }
      }
    }

    if (specialCounter < 1) {
      return [false, 'Your password must contain at least one special character'];
    }

    const NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let numberCounter = 0;

    for (let i=0; i<spl.length; i++) {
      for (let j=0; j<NUMBERS.length; j++) {
        if (spl[i] === NUMBERS[j]) { numberCounter++; }
      }
    }

    if (numberCounter < 1) {
      return [false, 'Your password must contain at least one number'];
    }

    return [true, ''];
  }

}
