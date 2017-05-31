import { FirebaseTimelineEvent } from './event-firebase.effects';
import { ProtectedFirebaseService } from '../shared/protected-firebase.service';
import { Injectable } from '@angular/core';

@Injectable()
export class EventsFirebaseService extends ProtectedFirebaseService<FirebaseTimelineEvent> {

  protected getFirebaseNodeName(): string {
    return 'events';
  }
}
