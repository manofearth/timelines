import { Injectable } from '@angular/core';
import { ProtectedFirebaseEffect } from '../../shared/firebase/protected-firebase.effect';
import { Timeline, TimelineGetAction, TimelineGetErrorAction, TimelineGetSuccessAction } from '../timeline.reducer';
import { Observable } from 'rxjs/Observable';
import { Actions } from '@ngrx/effects';
import { AuthFirebaseService } from 'app/protected/shared/firebase/auth-firebase.service';
import { FirebaseTimeline, TimelinesFirebaseService } from '../../timelines/timelines-firebase.service';
import { EventsFirebaseService, FirebaseTimelineEvent } from '../../event/events-firebase.service';
import { Subscription, TeardownLogic } from 'rxjs/Subscription';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class TimelineFirebaseGetEffect extends ProtectedFirebaseEffect<'TIMELINE_GET',
  TimelineGetAction,
  TimelineGetSuccessAction,
  'TIMELINE_GET_ERROR',
  TimelineGetErrorAction,
  Timeline> {

  protected runEffect(action: TimelineGetAction): Observable<Timeline> {
    return this.fireTimelines
      .getObject(action.payload)
      .switchMap((firebaseTimeline: FirebaseTimeline): Observable<Timeline> =>
        Observable.create((observer: Observer<Timeline>): TeardownLogic => {

          if (firebaseTimeline.events) {
            const eventsObservables: Observable<FirebaseTimelineEvent>[] = Object.keys(firebaseTimeline.events).map(
              (eventId: string) => this.fireEvents.getObject(eventId).first()
            );

            const subscription: Subscription = Observable
              .forkJoin(...eventsObservables)
              .subscribe((firebaseEvents: FirebaseTimelineEvent[]) => {
                observer.next(toTimeline(firebaseTimeline, firebaseEvents));
                observer.complete();
              });

            return () => {
              subscription.unsubscribe();
            };
          } else {
            observer.next(toTimeline(firebaseTimeline, []));
            observer.complete();
          }

        })
      );
  }

  protected mapToSuccessAction(timeline: Timeline): TimelineGetSuccessAction {
    return {
      type: 'TIMELINE_GET_SUCCESS',
      payload: timeline,
    }
  }

  protected getInterestedActionType(): 'TIMELINE_GET' {
    return 'TIMELINE_GET';
  }

  protected getErrorActionType(): 'TIMELINE_GET_ERROR' {
    return 'TIMELINE_GET_ERROR';
  }

  constructor(
    actions: Actions,
    auth: AuthFirebaseService,
    private fireTimelines: TimelinesFirebaseService,
    private fireEvents: EventsFirebaseService,
  ) {
    super(actions, auth);
  }
}

function toTimeline(firebaseTimeline: FirebaseTimeline, firebaseEvents: FirebaseTimelineEvent[]): Timeline {
  return {
    id: firebaseTimeline.$key,
    title: firebaseTimeline.title,
    events: firebaseEvents.map((firebaseEvent: FirebaseTimelineEvent) => ({
      id: firebaseEvent.$key,
      title: firebaseEvent.title,
      dateBegin: firebaseEvent.dateBegin,
      dateEnd: firebaseEvent.dateEnd,
    }))
  };
}
