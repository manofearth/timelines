import { LoginAction } from '../reducers';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AppState } from '../app-state';
import * as mapValues from 'lodash/mapValues';
import * as property from 'lodash/property';
import * as values from 'lodash/values';

interface LoginForm extends FormGroup {
  controls: {
    email: FormControl;
    password: FormControl;
    passwordAgain: FormControl;
  };
  value: LoginFormData;
}

export interface LoginFormData {
  email: string;
  password: string;
  passwordAgain: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {

  form: LoginForm;

  private readonly errorMessages: { [key: string]: string } = {
    required: 'Заполните все поля',
    passwordsNotEqual: 'Пароли не совпадают',
    incorrectEmail: 'Ошибка в email',
  };

  constructor(private fb: FormBuilder, private store: Store<AppState>) {

  }

  ngOnInit() {
    this.form = <LoginForm>this.fb.group({
      email: [null, Validators.compose([
        Validators.required,
        validateEmail,
      ])],
      password: [null, Validators.required],
      passwordAgain: [null, Validators.required],
    }, { validator: validateLoginForm });

  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const action: LoginAction = {
      type: 'ACTION_LOGIN',
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

function validateLoginForm(form: LoginForm) {

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