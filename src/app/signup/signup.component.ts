import { SignupAction } from '../reducers';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AppState } from '../app-state';
import * as mapValues from 'lodash/mapValues';
import * as property from 'lodash/property';
import * as values from 'lodash/values';

interface SignupForm extends FormGroup {
  controls: {
    email: FormControl;
    password: FormControl;
    passwordAgain: FormControl;
  };
  value: SignupFormData;
}

export interface SignupFormData {
  email: string;
  password: string;
  passwordAgain: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent implements OnInit {

  form: SignupForm;

  private readonly errorMessages: { [key: string]: string } = {
    required: 'Заполните все поля',
    passwordsNotEqual: 'Пароли не совпадают',
    incorrectEmail: 'Введите правильный email',
  };

  constructor(private fb: FormBuilder, private store: Store<AppState>) {

  }

  ngOnInit() {
    this.form = <SignupForm>this.fb.group({
      email: [null, Validators.compose([
        Validators.required,
        validateEmail,
      ])],
      password: [null, Validators.required],
      passwordAgain: [null, Validators.required],
    }, { validator: validateSignupForm });

  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const action: SignupAction = {
      type: 'ACTION_SIGNUP',
      payload: this.form.value
    };
    this.store.dispatch(action);
  }

  get submitButtonTitle() {

    if (this.form.errors === null) {
      return 'Зарегистрироваться';
    }

    const firstError = Object.keys(this.form.errors)[0];

    return this.errorMessages[firstError];
  }
}

function validateSignupForm(form: SignupForm) {

  const errors = values(mapValues(form.controls, property('errors')));
  const mergedErrors = Object.assign({}, ...errors);

  if (form.controls.password.value !== form.controls.passwordAgain.value) {
    mergedErrors.passwordsNotEqual = true;
  }

  if (Object.keys(mergedErrors).length === 0) {
    return null;
  }

  return mergedErrors;

}

function validateEmail(control: FormControl): null | { incorrectEmail: true } {
  const valueAsString = String(control.value);
  if (valueAsString.match(/^.+@.+\..+$/) === null) {
    return { incorrectEmail: true };
  } else {
    return null;
  }
}