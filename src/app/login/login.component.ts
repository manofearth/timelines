import {LoginAction} from '../reducers';
import {Validators, FormGroup, FormControl, FormBuilder} from '@angular/forms';
import {Store} from '@ngrx/store';
import {Component, OnInit} from '@angular/core';
import {AppState} from '../app-state';

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
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: LoginForm;

  constructor(private fb: FormBuilder, private store: Store<AppState>) {

  }

  ngOnInit() {
    this.form = <LoginForm>this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
      passwordAgain: [null, Validators.required],
    });
  }

  submit() {
    if(this.form.invalid) {
      return;
    }
    
    const action: LoginAction = {
      type: 'ACTION_LOGIN',
      payload: this.form.value
    }
    this.store.dispatch(action);
  }
}
