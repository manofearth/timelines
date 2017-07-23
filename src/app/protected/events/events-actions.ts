import { Action } from '@ngrx/store';
import { SearchResponseData } from '../shared/elastic-search.service';
import { EventHitHighlight, EventHitSource } from '../timeline/timeline-events-elastic-search.service';

export interface EventsSearchSuccessAction extends Action {
  type: 'EVENTS_SEARCH_SUCCESS';
  payload: {
    name: string;
    results: SearchResponseData<EventHitSource, EventHitHighlight>;
  }
}
