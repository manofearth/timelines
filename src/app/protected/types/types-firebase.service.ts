import { Injectable } from '@angular/core';
import { ProtectedFirebaseService } from '../shared/firebase/protected-firebase.service';
import { TypeKind } from '../type/type-states';

@Injectable()
export class TypesFirebaseService extends ProtectedFirebaseService<FirebaseType, FirebaseTypeUpdateObject> {

  protected getFirebaseNodeName(): string {
    return 'types';
  }

}

export interface FirebaseType {
  $key: string;
  title: string;
  kind: TypeKind;
}

export interface FirebaseTypeUpdateObject {
  title: string;
  kind: TypeKind;
}
