import { AppState } from '../reducers';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { composeChildrenValidators } from '../shared/compose-children-validators.validator';
import { ifEmptyObject, firstProperty, coalesce, notEmpty } from '../shared/helpers';
import { validateEmail } from '../shared/email.validator';
import { AuthState, SignupAction } from '../reducers/auth.reducer';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

const MIN_PASSWORD_LENGTH = 6;

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
export class SignupComponent implements OnInit, OnDestroy {

  form: SignupForm;
  error: Error;
  appStateSubscription: Subscription;

  private readonly errorMessages: { [key: string]: string } = {
    incorrectEmail: 'Введите правильный email',
    passwordsNotEqual: 'Пароли не совпадают',
    required: 'Заполните все поля',
    shortPassword: 'Введите пароль от ' + MIN_PASSWORD_LENGTH + ' символов',
  };

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
  ) {
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

    this.appStateSubscription = this.store.select('auth').subscribe((auth: AuthState) => {
      this.error = auth.error;
      this.changeDetector.markForCheck();
      if(auth.user && !auth.error) {
        this.router.navigate(['/timelines']);
      }
    });

  }

  ngOnDestroy(): void {
    this.appStateSubscription.unsubscribe();
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

    if (this.form.errors['shortPassword'] && notEmpty(this.form.controls.password.value)) {
      return this.errorMessages['shortPassword'];
    }

    const firstErrorKey = firstProperty(this.form.errors);

    return this.errorMessages[firstErrorKey];
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
