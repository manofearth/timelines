import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AlgoliaSearchService } from '../../shared/algolia/algolia-search.service';
import { Action } from '@ngrx/store';

@Injectable()
export class EventsAlgoliaClearCacheEffect {

  @Effect() effect = this.actions
    .ofType('EVENT_INSERT_SUCCESS', 'EVENT_UPDATE_SUCCESS', 'EVENT_FIREBASE_DELETE_SUCCESS')
    .do(() => this.algolia.clearCacheEvents())
    .map((): EventsAlgoliaClearCacheSuccessAction => ({
      type: 'EVENTS_ALGOLIA_CLEAR_CACHE_SUCCESS'
    }));

  constructor(
    private actions: Actions,
    private algolia: AlgoliaSearchService,
  ) {
  }
}

export interface EventsAlgoliaClearCacheSuccessAction extends Action {
  type: 'EVENTS_ALGOLIA_CLEAR_CACHE_SUCCESS';
}
