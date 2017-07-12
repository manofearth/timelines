import { Injectable } from '@angular/core';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { ProtectedFirebaseService } from '../shared/firebase/protected-firebase.service';

@Injectable()
export class TimelinesFirebaseService extends ProtectedFirebaseService<FirebaseTimeline, FirebaseTimelineUpdateObject> {

  attachEvent(timelineId: string, groupId: string, timelineEventId: string): Observable<void> {
    const promise: firebase.Promise<void> = this
      .eventAttachmentObject(timelineId, groupId, timelineEventId)
      .set(true);

    return Observable.fromPromise(promise as Promise<void>);

  }

  detachEvent(timelineId: string, groupId, timelineEventId: string): Observable<void> {
    const promise: firebase.Promise<void> = this
      .eventAttachmentObject(timelineId, groupId, timelineEventId)
      .remove();

    return Observable.fromPromise(promise as Promise<void>);

  }

  private eventAttachmentObject(timelineId: string, groupId: string, timelineEventId: string): FirebaseObjectObservable<boolean> {
    return this.database
      .object(this.getFirebaseObjectPath(timelineId) + '/groups/' + groupId + '/events/' + timelineEventId );
  }

  protected getFirebaseNodeName(): string {
    return 'timelines';
  }
}

export interface FirebaseTimeline {
  $key: string;
  title: string;
  groups?: FirebaseTimelineEventGroups;
}

export interface FirebaseTimelineEventGroups {
  [groupId: string]: FirebaseTimelineEventsGroup;
}

export interface FirebaseTimelineEventsGroup {
  title: string;
  color: string;
  events?: {
    [eventId: string]: true;
  }
}

export interface FirebaseTimelineUpdateObject {
  title: string;
  groups?: FirebaseTimelineEventGroups;
}
