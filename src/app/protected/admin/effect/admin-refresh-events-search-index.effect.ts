import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { ElasticSearchService } from '../../shared/elastic-search.service';

@Injectable()
export class AdminRefreshEventsSearchIndexEffect {

  @Effect() effect: Observable<Action> = this.actions
    .ofType('ADMIN_REFRESH_EVENTS_SEARCH_INDEX')
    .switchMap(() => {
      return this.elasticSearch
        .createIndex('events_v1')
        .map(() => ({
          type: 'ADMIN_REFRESH_EVENTS_SEARCH_INDEX_SUCCESS'
        }))
        .catch((error) => {
          return Observable.of<Action>({
            type: 'ADMIN_REFRESH_EVENTS_SEARCH_INDEX_ERROR',
            payload: error,
          })
        });
    });

  constructor(
    private actions: Actions,
    private elasticSearch: ElasticSearchService,
  ) {}
}
