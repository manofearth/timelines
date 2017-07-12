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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from './shared/logger.service';
import { EventFirebaseUpdateEffect } from './protected/event/effects/event-firebase-update.effect';
import { EventFirebaseInsertEffect } from './protected/event/effects/event-firebase-insert.effect';
import { EventFirebaseInsertAndAttachEffect } from './protected/event/effects/event-firebase-insert-and-attach.effect';
import { EventFirebaseDetachEffect } from './protected/event/effects/event-firebase-detach.effect';
import { EventFirebaseGetEffect } from './protected/event/effects/event-firebase-get.effect';
import { TimelinesFirebaseGetEffect } from './protected/timelines/effects/timelines-firebase-get.effect';
import { TimelineFirebaseCreateEffect } from './protected/timeline/effects/timeline-firebase-create.effect';
import { TimelineFirebaseDeleteEffect } from './protected/timeline/effects/timeline-firebase-delete.effect';
import { TimelineFirebaseGetEffect } from './protected/timeline/effects/timeline-firebase-get.effect';
import { TimelineFirebaseSaveEffect } from './protected/timeline/effects/timeline-firebase-save.effect';
import { AuthFirebaseService } from './protected/shared/firebase/auth-firebase.service';
import { TimelinesFirebaseService } from './protected/timelines/timelines-firebase.service';
import { EventsFirebaseService } from './protected/event/events-firebase.service';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { EventFirebaseAttachEffect } from './protected/event/effects/event-firebase-attach.effect';
import { EventToTimelineAttachingFirebaseService } from './protected/event/event-to-timeline-attaching-firebase.service';
import { TimelineFirebaseCreateGroupEffect } from './protected/timeline/effects/timeline-firebase-create-group.effect';

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
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    EffectsModule.run(FirebaseAuthEffects),
    // until https://github.com/angular/angular/issues/12869 fixed
    EffectsModule.run(TimelinesFirebaseGetEffect),
    EffectsModule.run(TimelineFirebaseCreateEffect),
    EffectsModule.run(TimelineFirebaseDeleteEffect),
    EffectsModule.run(TimelineFirebaseGetEffect),
    EffectsModule.run(TimelineFirebaseSaveEffect),
    EffectsModule.run(EventFirebaseGetEffect),
    EffectsModule.run(EventFirebaseInsertEffect),
    EffectsModule.run(EventFirebaseInsertAndAttachEffect),
    EffectsModule.run(EventFirebaseUpdateEffect),
    EffectsModule.run(EventFirebaseDetachEffect),
    EffectsModule.run(EventFirebaseAttachEffect),
    EffectsModule.run(TimelineFirebaseCreateGroupEffect),
  ],
  providers: [
    AuthGuard,
    AuthFirebaseService,
    Logger,
    // until https://github.com/angular/angular/issues/12869 fixed
    TimelinesFirebaseService,
    EventsFirebaseService,
    EventToTimelineAttachingFirebaseService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
