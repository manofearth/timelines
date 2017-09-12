import { Injectable } from '@angular/core';
import { AlgoliaSearchResult, AlgoliaSearchService, AlgoliaType } from '../../shared/algolia/algolia-search.service';
import { Actions, Effect } from '@ngrx/effects';
import { AppState } from '../../../reducers';
import { Action, Store } from '@ngrx/store';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { actionNameIs } from '../../../shared/action-name-is.fn';
import { TYPES_COMPONENT_NAME, TYPES_SEARCH_FIELD_NAME } from '../types.component';
import { EVENT_TYPE_SELECTOR_NAME } from '../../event/event.component';
import { toError } from '../../shared/firebase/protected-firebase.effect';

@Injectable()
export class TypesAlgoliaSearchEffect {
  constructor(
    private store: Store<AppState>,
    private actions: Actions,
    private algolia: AlgoliaSearchService,
    private fireAuth: AngularFireAuth,
  ) {
  }

  private typesListInit$: Observable<NamedQuery> = this.actions
    .ofType('COMPONENT_INIT')
    .filter(actionNameIs(TYPES_COMPONENT_NAME))
    .map(() => ({ name: TYPES_COMPONENT_NAME, query: '' }));

  private eventTypeSelectorButton$: Observable<NamedQuery> = this.actions
    .ofType('SELECTOR_SELECT_BUTTON')
    .filter(actionNameIs(EVENT_TYPE_SELECTOR_NAME))
    .map(() => ({ name: EVENT_TYPE_SELECTOR_NAME, query: '' }));

  private typesListQuery$: Observable<NamedQuery> = this.store
    .select<string>(state => state.types.query)
    .map(query => ({ name: TYPES_SEARCH_FIELD_NAME, query: query }));

  private eventTypeSelectorQuery$: Observable<NamedQuery> = this.store
    .select<string>(state => state.event.typeSelector.query)
    .map(query => ({ name: EVENT_TYPE_SELECTOR_NAME, query: query }));

  @Effect() effect: Observable<TypesSearchSuccessAction | TypesSearchErrorAction> = Observable
    .merge(
      this.typesListQuery$,
      this.eventTypeSelectorQuery$,
      this.typesListInit$,
      this.eventTypeSelectorButton$,
    )
    .filter(() => this.fireAuth.auth.currentUser !== null)
    .switchMap(({ name, query }) =>
      this.algolia
        .searchTypes(query)
        .map((result): TypesSearchSuccessAction => ({
          type: 'TYPES_SEARCH_SUCCESS',
          payload: {
            name: name,
            result: result
          }
        }))
        .catch(err => Observable.of<TypesSearchErrorAction>({
          type: 'TYPES_SEARCH_ERROR',
          payload: {
            name: name,
            error: toError(err)
          },
        }))
    );
}

interface NamedQuery {
  name: string;
  query: string;
}

export interface TypesSearchSuccessAction extends Action {
  type: 'TYPES_SEARCH_SUCCESS';
  payload: {
    name: string;
    result: AlgoliaSearchResult<AlgoliaType>;
  }
}

export interface TypesSearchErrorAction extends Action {
  type: 'TYPES_SEARCH_ERROR';
  payload: {
    name: string;
    error: Error;
  };
}
