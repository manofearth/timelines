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

  createGroup(timelineId: string, data: FirebaseGroupUpdateObject): Observable<firebase.database.Reference> {
    return Observable.fromPromise(
      this.database
        .list(this.getEventsGroupPath(timelineId))
        .push(data) as any
    );
  }

  saveGroup(timelineId: string, groupId: string, data: FirebaseGroupUpdateObject): Observable<void> {
    return Observable.fromPromise(
      this.database
        .object(this.getEventsGroupPath(timelineId) + '/' + groupId)
        .update(data) as Promise<void>
    );
  }

  deleteGroup(timelineId: string, groupId: string): Observable<void> {
    return Observable.fromPromise(
      this.database
        .list(this.getEventsGroupPath(timelineId))
        .remove(groupId) as Promise<void>
    );
  }

  private eventAttachmentObject(
    timelineId: string,
    groupId: string,
    timelineEventId: string
  ): FirebaseObjectObservable<boolean> {

    return this.database.object(this.getEventsGroupPath(timelineId) + '/' + groupId + '/events/' + timelineEventId);
  }

  private getEventsGroupPath(timelineId: string) {
    return this.getFirebaseObjectPath(timelineId) + '/groups';
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

export interface FirebaseGroupUpdateObject {
  title: string;
  color?: string;
}
