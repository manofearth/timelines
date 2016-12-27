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
import { reducer, initialState } from './reducers';
import { AuthGuard } from './auth/auth-guard.service';
import { StoreModule } from '@ngrx/store';
import { TimelinesFirebaseEffects } from './protected/timelines/timelines-firebase.effects';
import { TimelineFirebaseEffects } from './protected/timeline/timeline-firebase.effects';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
    NgbModule.forRoot(),
    RouterModule.forRoot(routes),
    StoreModule.provideStore(reducer, initialState),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    AngularFireModule.initializeApp(firebaseConfig),
    EffectsModule.run(FirebaseAuthEffects),
    // until https://github.com/angular/angular/issues/12869 fixed
    EffectsModule.run(TimelinesFirebaseEffects),
    EffectsModule.run(TimelineFirebaseEffects),
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
