import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { TimelineEventsElasticSearchService } from '../../timeline/timeline-events-elastic-search.service';

@Injectable()
export class EventsElasticSearchEffect {

  constructor(
    private actions: Actions,
    private elasticSearchTypes: TimelineEventsElasticSearchService,
  ) {
  }

  @Effect() effect = this.actions
    .ofType('SEARCH_FIELD_INPUT')
    .do(val => { console.log(val);})
    .filter(action => action.payload.name.startsWith('events_'))
    .switchMap(action =>
      this.elasticSearchTypes
        .search(action.payload.value)
        .map(results => [action, results])
    )
    .map(([action, results]) => ({
      type: 'EVENTS_SEARCH_SUCCESS',
      payload: {
        name: action.payload.name,
        results: results,
      }
    }));

}
