import { Injectable } from '@angular/core';
import { ProtectedFirebaseEffect } from '../../shared/firebase/protected-firebase.effect';
import { TimelineGetAction, TimelineGetErrorAction, TimelineGetSuccessAction } from '../timeline-actions';
import { Timeline } from '../timeline-states';
import { Actions, Effect } from '@ngrx/effects';
import { AuthFirebaseService } from '../../shared/firebase/auth-firebase.service';
import { FirebaseTimeline, TimelinesFirebaseService } from '../../timelines/timelines-firebase.service';
import { EventsFirebaseService, FirebaseTimelineEvent } from '../../event/events-firebase.service';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription, TeardownLogic } from 'rxjs/Subscription';
import 'rxjs/add/operator/first';

@Injectable()
export class TimelineFirebaseGetEffect extends ProtectedFirebaseEffect<TimelineGetAction,
  TimelineGetSuccessAction,
  TimelineGetErrorAction,
  Timeline> {

  @Effect()
  effect(): Observable<TimelineGetSuccessAction | TimelineGetErrorAction> {
    return super.createEffect();
  }

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
