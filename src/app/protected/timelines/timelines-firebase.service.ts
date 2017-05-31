import { Injectable } from '@angular/core';
import { FirebaseTimeline } from '../timeline/timeline-firebase.effects';
import { ProtectedFirebaseService } from '../shared/protected-firebase.service';

@Injectable()
export class TimelinesFirebaseService extends ProtectedFirebaseService<FirebaseTimeline> {

  protected getFirebaseNodeName(): string {
    return 'timelines';
  }
}
