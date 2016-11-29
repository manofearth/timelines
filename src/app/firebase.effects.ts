import { Injectable } from '@angular/core';
import { AngularFire, FirebaseAuthState } from 'angularfire2';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { SignupAction } from './reducers';
import { PromiseObservable } from 'rxjs/observable/PromiseObservable';

@Injectable()
export class FirebaseEffects {

  @Effect() signup: Observable<FirebaseAuthState> = this.actions
    .ofType('ACTION_SIGNUP')
    .flatMap((action: SignupAction) => <Promise<FirebaseAuthState>>this.fire.auth.createUser({
      email: action.payload.email,
      password: action.payload.password,
    }));

  @Effect() loggedIn: Observable<FirebaseAuthState> = this.fire.auth
    .do(val => { console.log(val); })
    .filter(() => false);

  constructor(private actions: Actions, private fire: AngularFire) { }

}
