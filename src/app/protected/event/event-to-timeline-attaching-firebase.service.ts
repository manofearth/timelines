import { Injectable } from '@angular/core';
import { EventsFirebaseService } from './events-firebase.service';
import { TimelinesFirebaseService } from '../timelines/timelines-firebase.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class EventToTimelineAttachingFirebaseService {

  constructor(
    private fireEvents: EventsFirebaseService,
    private fireTimelines: TimelinesFirebaseService,
  ) {
  }

  attach(timelineId: string, eventId: string): Observable<void> {
    return Observable
      .forkJoin(
        this.fireTimelines.attachEvent(timelineId, eventId),
        this.fireEvents.attachToTimeline(eventId, timelineId),
      )
      .map(() => {});
  }
}
