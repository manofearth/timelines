import { Injectable } from '@angular/core';
import { ProtectedFirebaseEffect } from '../../shared/firebase/protected-firebase.effect';
import { TimelineGetAction, TimelineGetErrorAction, TimelineGetSuccessAction } from '../timeline-actions';
import { Timeline, TimelineEventForTimeline, TimelineEventsGroup } from '../timeline-states';
import { Actions, Effect } from '@ngrx/effects';
import { AuthFirebaseService } from '../../shared/firebase/auth-firebase.service';
import { FirebaseTimeline, TimelinesFirebaseService } from '../../timelines/timelines-firebase.service';
import { EventsFirebaseService, FirebaseTimelineEvent } from '../../event/events-firebase.service';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription, TeardownLogic } from 'rxjs/Subscription';
import 'rxjs/add/operator/first';
import { FirebaseType, TypesFirebaseService } from '../../types/types-firebase.service';
import { toType } from '../../type/effects/type-get.effect';

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

          if (firebaseTimeline.groups) {
            const eventsObservables: Observable<FirebaseTimelineEvent>[] = extractEventsIds(firebaseTimeline)
              .map(
                eventId => this.fireEvents.getObject(eventId).first()
              );

            const subscription: Subscription = Observable
              .forkJoin(...eventsObservables)
              .switchMap((fireEvents: FirebaseTimelineEvent[]) => {
                const typesObservables: Observable<FirebaseType>[] = extractTypesIds(fireEvents)
                  .map(
                    typeId => this.fireTypes.getObject(typeId).first()
                  );

                return Observable
                  .forkJoin(...typesObservables)
                  .map((fireTypes: FirebaseType[]) => ({
                    fireEventsDict: toDictionary(fireEvents, '$key'),
                    fireTypesDict: toDictionary(fireTypes, '$key')
                  }));
              })
              .subscribe(({ fireEventsDict, fireTypesDict }) => {
                observer.next(toTimeline(firebaseTimeline, fireEventsDict, fireTypesDict));
                observer.complete();
              });

            return () => {
              subscription.unsubscribe();
            };
          } else {
            observer.next(toTimeline(firebaseTimeline, {}, {}));
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
    private fireTypes: TypesFirebaseService,
  ) {
    super(actions, auth);
  }
}

function extractEventsIds(firebaseTimeline: FirebaseTimeline): string[] {
  return Object.keys(firebaseTimeline.groups)
    .reduce<string[]>(
      (acc, groupId) => {
        if (firebaseTimeline.groups[ groupId ].events) {
          return acc.concat(Object.keys(firebaseTimeline.groups[ groupId ].events));
        } else {
          return acc;
        }
      },
      []
    );
}

function onlyUnique<T>(value: T, index: number, arr: T[]) {
  return arr.indexOf(value) === index;
}

function extractTypesIds(fireEvents: FirebaseTimelineEvent[]): string[] {
  return fireEvents.map(fireEvent => fireEvent.typeId).filter(onlyUnique);
}

interface Dictionary<T> {
  [key: string]: T
}

function toDictionary<T>(arr: T[], keyProp: keyof T): Dictionary<T> {
  return arr.reduce<Dictionary<T>>((acc, obj) => {
    acc[ obj[ keyProp ].toString() ] = obj;
    return acc;
  }, {});
}

function toTimeline(
  firebaseTimeline: FirebaseTimeline,
  fireEventsDict: Dictionary<FirebaseTimelineEvent>,
  fireTypesDict: Dictionary<FirebaseType>,
): Timeline {

  const groups = Object.keys(firebaseTimeline.groups).reduce<TimelineEventsGroup[]>(
    (acc, groupId) => {

      let events: TimelineEventForTimeline[] = [];
      if (firebaseTimeline.groups[ groupId ].events) {
        events = Object.keys(firebaseTimeline.groups[ groupId ].events)
          .map((eventId: string) => ({
            fireEvent: fireEventsDict[ eventId ],
            fireType: fireTypesDict[ fireEventsDict[ eventId ].typeId ],
          }))
          .map(toTimelineEventForTimeline);
      }

      acc.push({
        id: groupId,
        title: firebaseTimeline.groups[ groupId ].title,
        color: firebaseTimeline.groups[ groupId ].color,
        events: events,
      });
      return acc;
    },
    []
  );

  return {
    id: firebaseTimeline.$key,
    title: firebaseTimeline.title,
    groups,
  };
}

function toTimelineEventForTimeline(
  { fireEvent, fireType }: { fireEvent: FirebaseTimelineEvent, fireType: FirebaseType }
): TimelineEventForTimeline {
  return {
    id: fireEvent.$key,
    title: fireEvent.title,
    type: toType(fireType),
    dateBegin: fireEvent.dateBegin,
    dateEnd: fireEvent.dateEnd,
  }
}
