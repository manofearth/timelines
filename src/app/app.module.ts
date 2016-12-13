import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from '../environments/firebase.config';
import { EffectsModule } from '@ngrx/effects';
import { FirebaseAuthEffects } from './auth/firebase-auth.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducer, initialState } from './reducers/index';
import { AuthGuard } from './auth/auth-guard.service';
import { StoreModule } from '@ngrx/store';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/timelines',
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: 'app/protected/protected.module#ProtectedModule',
  },
  {
    path: '**',
    redirectTo: '/',
  }
];

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    StoreModule.provideStore(reducer, initialState),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    AngularFireModule.initializeApp(firebaseConfig),
    EffectsModule.run(FirebaseAuthEffects),
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
