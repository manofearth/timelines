import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { TypesElasticSearchHit, TypesElasticSearchService } from '../types-elastic-search.service';
import { SearchFieldInputAction } from '../../shared/search-field/search-field-actions';
import { Action } from '@ngrx/store';
import { TYPES_COMPONENT_NAME, TYPES_SEARCH_FIELD_NAME } from '../types.component';
import { toError } from '../../shared/firebase/protected-firebase.effect';
import { EVENT_TYPE_SELECTOR_NAME } from '../../event/event.component';
import { SelectorSelectButtonAction } from '../../shared/selector-select/selector-select-actions';
import { ComponentInitAction } from '../../../shared/component-init-action';

type InterestingAction = ComponentInitAction | SearchFieldInputAction | SelectorSelectButtonAction;

@Injectable()
export class ElasticTypesSearchEffect {

  constructor(
    private actions: Actions,
    private elasticSearchTypes: TypesElasticSearchService,
  ) {
  }

  @Effect() effect: Observable<TypesSearchSuccessAction | TypesSearchErrorAction> = this.actions
    .filter<InterestingAction>(action =>
      action.type === 'COMPONENT_INIT' && action.payload.name === TYPES_COMPONENT_NAME
      || (
        action.type === 'SEARCH_FIELD_INPUT'
        && (action.payload.name === TYPES_SEARCH_FIELD_NAME || action.payload.name === EVENT_TYPE_SELECTOR_NAME)
      )
      || (
        action.type === 'SELECTOR_SELECT_BUTTON' && action.payload.name === EVENT_TYPE_SELECTOR_NAME
      )
    )
    .map<InterestingAction, { name: string, query: string }>(action => {
      if (action.type === 'COMPONENT_INIT' || action.type === 'SELECTOR_SELECT_BUTTON') {
        return { name: action.payload.name, query: null }; // no search query
      } else {
        return { name: action.payload.name, query: action.payload.value };
      }
    })
    .switchMap(({ name, query }) =>
      this.elasticSearchTypes
        .search(query)
        .map(searchResult => ({
          type: 'TYPES_SEARCH_SUCCESS' as 'TYPES_SEARCH_SUCCESS',
          payload: {
            name: name,
            hits: searchResult.hits.hits
          }
        }))
        .catch(err => Observable.of({
          type: 'TYPES_SEARCH_ERROR' as 'TYPES_SEARCH_ERROR',
          payload: {
            name: name,
            error: toError(err)
          },
        }))
    );
}

export interface TypesSearchSuccessAction extends Action {
  type: 'TYPES_SEARCH_SUCCESS';
  payload: {
    name: string;
    hits: TypesElasticSearchHit[];
  }
}

export interface TypesSearchErrorAction extends Action {
  type: 'TYPES_SEARCH_ERROR';
  payload: {
    name: string;
    error: Error;
  };
}