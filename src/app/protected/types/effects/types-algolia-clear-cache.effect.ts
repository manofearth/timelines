import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AlgoliaSearchService } from '../../shared/algolia/algolia-search.service';
import { Action } from '@ngrx/store';

@Injectable()
export class TypesAlgoliaClearCacheEffect {

  @Effect() effect = this.actions
    .ofType('TYPE_CREATE_SUCCESS', 'TYPE_UPDATE_SUCCESS', 'TYPE_DELETE_SUCCESS')
    .do(() => this.algolia.clearCacheTypes())
    .map((): TypesAlgoliaClearCacheSuccessAction => ({
      type: 'TYPES_ALGOLIA_CLEAR_CACHE_SUCCESS'
    }));

  constructor(
    private actions: Actions,
    private algolia: AlgoliaSearchService,
  ) {
  }
}

export interface TypesAlgoliaClearCacheSuccessAction extends Action {
  type: 'TYPES_ALGOLIA_CLEAR_CACHE_SUCCESS';
}
