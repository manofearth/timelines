import { StoreModule } from '@ngrx/store';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from '../environments/firebase.config';
import { EffectsModule } from '@ngrx/effects';
import { FirebaseEffects } from './firebase.effects';
import { authReducer } from './reducers/auth.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

const routes: Routes = [
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    StoreModule.provideStore(
      { auth: authReducer },
      { auth: { error: null, user: null } }
    ),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    AngularFireModule.initializeApp(firebaseConfig),
    EffectsModule.run(FirebaseEffects),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
