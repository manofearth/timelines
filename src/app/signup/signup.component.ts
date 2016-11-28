import { SignupAction } from '../reducers';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AppState } from '../app-state';
import { composeChildrenValidators } from '../shared/compose-children-validators.validator';
import { ifEmptyObject, firstProperty } from '../shared/helpers';
import { validateEmail } from '../shared/email.validator';

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

  // noinspection JSUnusedGlobalSymbols
  get submitButtonTitle() {

    if (this.form.errors === null) {
      return 'Зарегистрироваться';
    }

    const firstErrorKey = firstProperty(this.form.errors);

    return this.errorMessages[firstErrorKey];
  }
}

function validateSignupForm(form: SignupForm) {

  const errors = Object.assign({}, composeChildrenValidators(form));

  if (form.controls.password.value !== form.controls.passwordAgain.value) {
    errors['passwordsNotEqual'] = true;
  }

  return ifEmptyObject(errors, null);
}
