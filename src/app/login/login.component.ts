import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../app-state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: LoginForm;

  constructor(private fb: FormBuilder, private store: Store<AppState>) { }

  ngOnInit() {
    this.form = <LoginForm>this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  submit() {

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
