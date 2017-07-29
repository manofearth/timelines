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
import { SearchFieldInputAction } from '../../shared/search-field/search-field-actions';
import { TIMELINE_EVENTS_SELECTOR_NAME_PREFIX } from '../../timeline/events/timeline-events-table.component';

@Injectable()
export class EventsElasticSearchEffect {

  constructor(
    private actions: Actions,
    private elasticSearchTypes: TimelineEventsElasticSearchService,
  ) {
  }

  @Effect() effect: Observable<EventsSearchResultAction> = this.actions
    .ofType('SEARCH_FIELD_INPUT')
    .filter<SearchFieldInputAction>(action =>
      action.payload.name.startsWith(TIMELINE_EVENTS_SELECTOR_NAME_PREFIX) && action.payload.value.length !== 0)
    .switchMap<SearchFieldInputAction, EventsSearchResultAction>(action =>
      this.elasticSearchTypes
        .search(action.payload.value)
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
