import { FormControl } from '@angular/forms';

export function validateEmail(control: FormControl): null | { incorrectEmail: true } {
  const valueAsString = String(control.value);
  if (valueAsString.match(/^.+@.+\..+$/) === null) {
    return { incorrectEmail: true };
  } else {
    return null;
  }
}
