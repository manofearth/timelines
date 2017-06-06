import { ProtectedFirebaseService } from '../shared/firebase/protected-firebase.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { FirebaseObjectObservable } from 'angularfire2';
import { TimelineDate } from '../shared/date';

@Injectable()
export class EventsFirebaseService extends ProtectedFirebaseService<FirebaseTimelineEvent, FirebaseEventUpdateObject> {

  attachToTimeline(timelineEventKey: string, timelineKey: string): Observable<void> {
    const promise: firebase.Promise<void> = this
      .timelineAttachmentObject(timelineEventKey, timelineKey)
      .set(true);

    return Observable.fromPromise(promise as Promise<void>);
  }

  detachFromTimeline(timelineEventKey: string, timelineKey: string): Observable<void> {
    const promise: firebase.Promise<void> = this
      .timelineAttachmentObject(timelineEventKey, timelineKey)
      .remove();

    return Observable.fromPromise(promise as Promise<void>);
  }

  private timelineAttachmentObject(timelineEventId: string, timelineId: string): FirebaseObjectObservable<boolean> {
    return this.database.object(this.getFirebaseObjectPath(timelineEventId) + '/timelines/' + timelineId);
  }

  protected getFirebaseNodeName(): string {
    return 'events';
  }
}

export interface FirebaseEventUpdateObject {
  title: string;
  dateBegin: TimelineDate;
  dateEnd: TimelineDate;
}

export interface FirebaseTimelineEvent {
  $key: string;
  title: string;
  dateBegin: TimelineDate;
  dateEnd: TimelineDate;
}
