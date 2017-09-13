import { Effect } from '@ngrx/effects';
import {
  AlgoliaInfoSource,
  AlgoliaSearchResult,
  AlgoliaSearchService
} from '../../shared/algolia/algolia-search.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/switchMap';
import { Action, Store } from '@ngrx/store';
import { toError } from '../../shared/firebase/protected-firebase.effect';
import { Injectable } from '@angular/core';
import { AppState } from '../../../reducers';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class InfoSourcesAlgoliaSearchEffect {

  private infoSourcesListSearchQuery$: Observable<string> = this.store
    .select<string>(state => state.infoSourcesList.query);

  @Effect() effect: Observable<InfoSourcesAlgoliaSearchSuccessAction | InfoSourcesAlgoliaSearchErrorAction> = this
    .infoSourcesListSearchQuery$
    .filter(() => this.auth.auth.currentUser !== null)
    .switchMap(query => this.algolia
      .searchInfoSources(query)
      .map((result): InfoSourcesAlgoliaSearchSuccessAction => ({
        type: 'INFO_SOURCES_ALGOLIA_SEARCH_SUCCESS',
        payload: result
      }))
      .catch(err => Observable.of<InfoSourcesAlgoliaSearchErrorAction>({
        type: 'INFO_SOURCES_ALGOLIA_SEARCH_ERROR',
        payload: toError(err)
      }))
    );

  constructor(
    private store: Store<AppState>,
    private algolia: AlgoliaSearchService,
    private auth: AngularFireAuth,
  ) {
  }
}

export interface InfoSourcesAlgoliaSearchSuccessAction extends Action {
  type: 'INFO_SOURCES_ALGOLIA_SEARCH_SUCCESS';
  payload: AlgoliaSearchResult<AlgoliaInfoSource>;
}

export interface InfoSourcesAlgoliaSearchErrorAction extends Action {
  type: 'INFO_SOURCES_ALGOLIA_SEARCH_ERROR';
  payload: Error;
}
