import { Injectable } from '@angular/core';
import { ProtectedFirebaseService } from '../shared/firebase/protected-firebase.service';

@Injectable()
export class TypesFirebaseService extends ProtectedFirebaseService<FirebaseType, FirebaseTypeUpdateObject> {

  protected getFirebaseNodeName(): string {
    return 'types';
  }

}

export interface FirebaseType {
  $key: string;
  title: string;
  kind: string;
}

export interface FirebaseTypeUpdateObject {
  title: string;
}
