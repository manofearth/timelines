import { Actions, Effect } from '@ngrx/effects';
import 'rxjs/add/operator/debounceTime';
import { Observable } from 'rxjs/Observable';
import {
  TimelineEventFinderChangedAction,
  TimelineEventFinderSearchErrorAction,
  TimelineEventFinderSearchSuccessAction
} from '../timeline.reducer';
import { Http, Response } from '@angular/http';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';

const USER_INPUT_DEBOUNCE_TIME = 1500;
const TIMELINE_EVENTS_SEARCH_URL = 'https://us-central1-timelines-26da8.cloudfunctions.net/queryElasticSearch';
type EffectObservable = Observable<TimelineEventFinderSearchSuccessAction | TimelineEventFinderSearchErrorAction>;

@Injectable()
export class TimelineEventFinderSearchEffect {

  @Effect() search: EffectObservable = this.actions
    .ofType('EVENT_FINDER_CHANGED')
    .debounceTime(USER_INPUT_DEBOUNCE_TIME)
    .switchMap((action: TimelineEventFinderChangedAction) => this.http
      .get(TIMELINE_EVENTS_SEARCH_URL, {
        params: {
          q: action.payload,
          o: this.fireAuth.auth.currentUser.uid,
        }
      })
      .map((res: Response) => ({
        payload: 'TIMELINE_EVENT_FINDER_SEARCH_SUCCESS'
      } as TimelineEventFinderSearchSuccessAction))
    );


  constructor(
    private actions: Actions,
    private http: Http,
    private fireAuth: AngularFireAuth,
  ) {
  }
}
