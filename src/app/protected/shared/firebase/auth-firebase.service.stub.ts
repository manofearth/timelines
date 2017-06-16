import { AuthFirebaseService } from './auth-firebase.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User as FireUser } from 'firebase';

export class AuthFirebaseServiceStub extends AuthFirebaseService {

  private fireAuthStates$: BehaviorSubject<FirebaseAuthStateStub>;

  constructor() {
    const fireAuthStates$ = new BehaviorSubject<FirebaseAuthStateStub>(null);
    super(fireAuthStates$ as any);
    this.fireAuthStates$ = fireAuthStates$;
  }

  logIn(uid: string) {
    this.fireAuthStates$.next({
      uid: uid,
    });
  }
}

type FirebaseAuthStateStub = {
  [P in keyof FireUser]?: FireUser[P];
}
