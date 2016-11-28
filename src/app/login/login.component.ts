import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../app-state';
import { LoginAction } from '../reducers';
import { composeChildrenValidators } from '../shared/compose-children-validators.validator';
import { firstProperty } from '../shared/helpers';
import { validateEmail } from '../shared/email.validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: LoginForm;

  private readonly errorMessages: { [key: string]: string } = {
    required: 'Заполните все поля',
    incorrectEmail: 'Введите правильный email',
  };

  constructor(private fb: FormBuilder, private store: Store<AppState>) {
  }

  ngOnInit() {
    this.form = <LoginForm>this.fb.group({
      email: [null, Validators.compose([Validators.required, validateEmail])],
      password: [null, Validators.required],
    }, { validator: composeChildrenValidators });
  }

  submit() {
    const action: LoginAction = {
      type: 'ACTION_LOGIN',
      payload: this.form.value,
    };

    this.store.dispatch(action);

  }

  // noinspection JSUnusedGlobalSymbols
  get submitButtonTitle() {

    if (this.form.errors === null) {
      return 'Войти';
    }

    const firstErrorKey = firstProperty(this.form.errors);

    return this.errorMessages[firstErrorKey];
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
