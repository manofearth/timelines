import { Effect } from '@ngrx/effects';
import { AlgoliaEvent, AlgoliaSearchResult, AlgoliaSearchService } from '../../shared/algolia/algolia-search.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/switchMap';
import { Action, Store } from '@ngrx/store';
import { toError } from '../../shared/firebase/protected-firebase.effect';
import { Injectable } from '@angular/core';
import { AppState } from '../../../reducers';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class EventsAlgoliaSearchEffect {

  private eventsListSearchQuery$: Observable<string> = this.store
    .select<string>(state => state.eventsList.query);

  @Effect() effect: Observable<EventsAlgoliaSearchSuccessAction | EventsAlgoliaSearchErrorAction> = this
    .eventsListSearchQuery$
    .filter(() => this.auth.auth.currentUser !== null)
    .switchMap(query => this.algolia
      .searchEvents(query)
      .map((result): EventsAlgoliaSearchSuccessAction => ({
        type: 'EVENTS_ALGOLIA_SEARCH_SUCCESS',
        payload: result
      }))
      .catch(err => Observable.of<EventsAlgoliaSearchErrorAction>({
        type: 'EVENTS_ALGOLIA_SEARCH_ERROR',
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

export interface EventsAlgoliaSearchSuccessAction extends Action {
  type: 'EVENTS_ALGOLIA_SEARCH_SUCCESS';
  payload: AlgoliaSearchResult<AlgoliaEvent>;
}

export interface EventsAlgoliaSearchErrorAction extends Action {
  type: 'EVENTS_ALGOLIA_SEARCH_ERROR';
  payload: Error;
}
