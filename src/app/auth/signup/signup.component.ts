import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthComponent } from '../auth.component';
import { SignupAction } from '../../reducers/auth.reducer';
import { AppState } from '../../reducers/index';
import { notEmpty, firstProperty, ifEmptyObject, coalesce } from '../../shared/helpers';
import { validateEmail } from '../../shared/email.validator';
import { composeChildrenValidators } from '../../shared/compose-children-validators.validator';

const MIN_PASSWORD_LENGTH = 6;

export interface SignupForm extends FormGroup {
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
  templateUrl: 'signup.component.html',
  styleUrls: ['signup.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent extends AuthComponent<SignupForm, SignupAction> {


  private readonly errorMessages: { [key: string]: string } = {
    incorrectEmail: 'Введите правильный email',
    passwordsNotEqual: 'Пароли не совпадают',
    required: 'Заполните все поля',
    shortPassword: 'Введите пароль от ' + MIN_PASSWORD_LENGTH + ' символов',
  };

  constructor(fb: FormBuilder,
              store: Store<AppState>,
              router: Router,
              changeDetector: ChangeDetectorRef,) {
    super(fb, store, router, changeDetector);
  }

  // noinspection JSUnusedGlobalSymbols
  get submitButtonTitle() {

    if (this.form.errors === null) {
      return 'Зарегистрироваться';
    }

    if (this.form.errors['shortPassword'] && notEmpty(this.form.controls.password.value)) {
      return this.errorMessages['shortPassword'];
    }

    const firstErrorKey = firstProperty(this.form.errors);

    return this.errorMessages[firstErrorKey];
  }

  protected createForm(): SignupForm {

    return <SignupForm>this.fb.group({
      email: [null, Validators.compose([
        Validators.required,
        validateEmail,
      ])],
      password: [null, Validators.required],
      passwordAgain: [null, Validators.required],
    }, { validator: validateSignupForm });

  }

  protected createAction(): SignupAction {
    return {
      type: 'ACTION_SIGNUP',
      payload: this.form.value
    };
  }

}

function validateSignupForm(form: SignupForm) {

  const errors = Object.assign({}, composeChildrenValidators(form));

  if (coalesce(form.controls.password.value, '').length < MIN_PASSWORD_LENGTH) {
    errors['shortPassword'] = true;
  }
  if (form.controls.password.value !== form.controls.passwordAgain.value) {
    errors['passwordsNotEqual'] = true;
  }

  return ifEmptyObject(errors, null);
}
