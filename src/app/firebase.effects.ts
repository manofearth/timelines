import { Injectable } from '@angular/core';
import { AngularFire, FirebaseAuthState } from 'angularfire2';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { SignupAction } from './reducers';
import { PromiseObservable } from 'rxjs/observable/PromiseObservable';

@Injectable()
export class FirebaseEffects {

  constructor(private actions: Actions, private fire: AngularFire) { }

  @Effect() signup: Observable<FirebaseAuthState> = this.actions
    .ofType('ACTION_SIGNUP')
    .switchMap((action: SignupAction) => PromiseObservable.create<FirebaseAuthState>(
      <Promise<FirebaseAuthState>>this.fire.auth.createUser({
        email: action.payload.email,
        password: action.payload.password,
      })
    ));

}
