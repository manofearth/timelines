import { Injectable } from '@angular/core';
import { User as FireUser } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';


@Injectable()
export class AuthFirebaseService {

  private authState: FireUser;

  constructor(private fireAuth: AngularFireAuth) {
    this.fireAuth.authState.subscribe((state: FireUser) => {
      this.authState = state;
    });
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
