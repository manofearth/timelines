import { Injectable } from '@angular/core';
import { FirebaseObjectObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { ProtectedFirebaseService } from '../shared/firebase/protected-firebase.service';

@Injectable()
export class TimelinesFirebaseService extends ProtectedFirebaseService<FirebaseTimeline, FirebaseTimelineUpdateObject> {

  attachEvent(timelineId: string, timelineEventId: string): Observable<void> {
    const promise: firebase.Promise<void> = this
      .eventAttachmentObject(timelineId, timelineEventId)
      .set(true);

    return Observable.fromPromise(promise as Promise<void>);

  }

  detachEvent(timelineId: string, timelineEventId: string): Observable<void> {
    const promise: firebase.Promise<void> = this
      .eventAttachmentObject(timelineId, timelineEventId)
      .remove();

    return Observable.fromPromise(promise as Promise<void>);

  }

  private eventAttachmentObject(timelineId: string, timelineEventId: string): FirebaseObjectObservable<boolean> {
    return this.database
      .object(this.getFirebaseObjectPath(timelineId) + '/events/' + timelineEventId);
  }

  protected getFirebaseNodeName(): string {
    return 'timelines';
  }
}

export interface FirebaseTimeline {
  $key: string;
  title: string;
  events?: { [key: string]: true };
}

export interface FirebaseTimelineUpdateObject {
  title: string;
}
