import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AuthComponent } from '../auth.component';
import { LoginAction } from '../../reducers/auth.reducer';
import { AppState } from '../../reducers/index';
import { firstProperty } from '../../shared/helpers';
import { composeChildrenValidators } from '../../shared/compose-children-validators.validator';
import { validateEmail } from '../../shared/email.validator';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent extends AuthComponent<LoginForm, LoginAction> {

  form: LoginForm;

  private readonly errorMessages: { [key: string]: string } = {
    required: 'Заполните все поля',
    incorrectEmail: 'Введите правильный email',
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
      return 'Войти';
    }

    const firstErrorKey = firstProperty(this.form.errors);

    return this.errorMessages[firstErrorKey];
  }

  protected createForm(): LoginForm {

    return <LoginForm>this.fb.group({
      email: [null, Validators.compose([Validators.required, validateEmail])],
      password: [null, Validators.required],
    }, { validator: composeChildrenValidators });
  }

  protected createAction(): LoginAction {
    return {
      type: 'ACTION_LOGIN',
      payload: this.form.value
    };
  }

}

export interface LoginFormData {
  email: string;
  password: string;
}

interface LoginForm extends FormGroup {
  controls: {
    email: FormControl;
    password: FormControl;
  };
  value: LoginFormData;
}
