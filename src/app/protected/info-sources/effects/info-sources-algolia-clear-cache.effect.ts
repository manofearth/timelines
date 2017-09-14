import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AlgoliaSearchService } from '../../shared/algolia/algolia-search.service';
import { Action } from '@ngrx/store';

@Injectable()
export class InfoSourcesAlgoliaClearCacheEffect {

  @Effect() effect = this.actions
    .ofType(
      'INFO_SOURCE_FIREBASE_INSERT_SUCCESS',
      'INFO_SOURCE_FIREBASE_UPDATE_SUCCESS',
      'INFO_SOURCE_FIREBASE_DELETE_SUCCESS',
    )
    .do(() => this.algolia.clearCacheInfoSources())
    .map((): InfoSourcesAlgoliaClearCacheSuccessAction => ({
      type: 'INFO_SOURCES_ALGOLIA_CLEAR_CACHE_SUCCESS'
    }));

  constructor(
    private actions: Actions,
    private algolia: AlgoliaSearchService,
  ) {
  }
}

export interface InfoSourcesAlgoliaClearCacheSuccessAction extends Action {
  type: 'INFO_SOURCES_ALGOLIA_CLEAR_CACHE_SUCCESS';
}
