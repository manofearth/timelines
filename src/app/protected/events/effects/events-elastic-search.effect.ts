import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import {
  EventHitHighlight,
  EventHitSource,
  TimelineEventsElasticSearchService
} from '../../timeline/timeline-events-elastic-search.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { toError } from '../../shared/firebase/protected-firebase.effect';
import { Action } from '@ngrx/store';
import { SearchResponseData } from '../../shared/elastic-search.service';

@Injectable()
export class EventsElasticSearchEffect {

  constructor(
    private actions: Actions,
    private elasticSearchTypes: TimelineEventsElasticSearchService,
  ) {
  }

  @Effect() effect: Observable<EventsSearchResultAction> = this.actions
    .ofType('EVENTS_SEARCH')
    .switchMap<EventsSearchAction, EventsSearchResultAction>(action =>
      this.elasticSearchTypes
        .search(action.payload.query)
        .map<EventsSearchResponseData, EventsSearchResultAction>(result => ({
          type: 'EVENTS_SEARCH_SUCCESS',
          payload: {
            name: action.payload.name,
            result: result,
          }
        }))
        .catch(err => Observable.of<EventsSearchErrorAction>({
          type: 'EVENTS_SEARCH_ERROR',
          payload: {
            name: action.payload.name,
            error: toError(err)
          },
        }))
    );

}

export type EventsSearchResultAction = EventsSearchSuccessAction | EventsSearchErrorAction;
export type EventsSearchResponseData = SearchResponseData<EventHitSource, EventHitHighlight>;

export interface EventsSearchAction extends Action {
  type: 'EVENTS_SEARCH';
  payload: {
    name: string;
    query: string;
  }
}

export interface EventsSearchSuccessAction extends Action {
  type: 'EVENTS_SEARCH_SUCCESS';
  payload: {
    name: string;
    result: EventsSearchResponseData;
  }
}

export interface EventsSearchErrorAction extends Action {
  type: 'EVENTS_SEARCH_ERROR';
  payload: {
    name: string;
    error: Error;
  }
}
