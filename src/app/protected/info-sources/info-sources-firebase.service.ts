import { Injectable } from '@angular/core';
import { ProtectedFirebaseService } from '../shared/firebase/protected-firebase.service';

@Injectable()
export class InfoSourcesFirebaseService
  extends ProtectedFirebaseService<FirebaseInfoSource, FirebaseInfoSourceUpdateObject> {

  protected getFirebaseNodeName(): string {
    return 'info-sources';
  }
}


export interface FirebaseInfoSourceUpdateObject {
  title: string;
}

export interface FirebaseInfoSource {
  $key: string;
  $exists: () => boolean;
  title: string;
}
