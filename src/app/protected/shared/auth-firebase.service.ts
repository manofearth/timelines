import { Injectable } from '@angular/core';
import { AngularFireAuth, FirebaseAuthState } from 'angularfire2';

@Injectable()
export class AuthFirebaseService {

  private authState: FirebaseAuthState;

  constructor(private fireAuth: AngularFireAuth) {
    this.fireAuth.subscribe((state: FirebaseAuthState) => {
      this.authState = state;
    });
  }

  get auth$(): AngularFireAuth {
    return this.fireAuth;
  }

  get isLoggedIn(): boolean {
    return this.authState !== null;
  }

  get uid(): string | null {
    if (!this.authState) {
      return null;
    }
    return this.authState.uid;
  }

}
