import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { TypesElasticSearchHit, TypesElasticSearchService } from '../types-elastic-search.service';
import { TimelineEventsTypeForList } from '../types-states';
import { SearchFieldInputAction } from '../../shared/search-field/search-field-actions';
import { Action } from '@ngrx/store';
import { TYPES_COMPONENT_NAME, TYPES_SEARCH_FIELD_NAME, TypesComponentInitAction } from '../types.component';
import { toError } from '../../shared/firebase/protected-firebase.effect';
import { EVENT_TYPE_SELECTOR_NAME } from '../../event/event.component';

@Injectable()
export class ElasticTypesGetEffect {

  constructor(
    private actions: Actions,
    private elasticSearchTypes: TypesElasticSearchService,
  ) {
  }

  @Effect() effect: Observable<TypesGetSuccessAction | TypesGetErrorAction> = this.actions
    .filter<InterestingAction>(action =>
      action.type === 'TYPES_COMPONENT_INIT'
      || (
        action.type === 'SEARCH_FIELD_INPUT'
        && (action.payload.name === TYPES_SEARCH_FIELD_NAME || action.payload.name === EVENT_TYPE_SELECTOR_NAME)
      )
    )
    .map<InterestingAction, { name: string, query: string }>(action => {
      if (action.type === 'TYPES_COMPONENT_INIT') {
        return { name: TYPES_COMPONENT_NAME, query: null }; // no search query
      } else {
        return { name: action.payload.name, query: action.payload.value };
      }
    })
    .switchMap(({ name, query }) =>
      this.elasticSearchTypes
        .search(query)
        .map(searchResult => ({
          type: 'TYPES_GET_SUCCESS' as 'TYPES_GET_SUCCESS',
          payload: {
            name: name,
            results: searchResult.hits.hits.map(toTimelineEventsType)
          }
        }))
        .catch(err => Observable.of({
          type: 'TYPES_GET_ERROR' as 'TYPES_GET_ERROR',
          payload: {
            name: name,
            error: toError(err)
          },
        }))
    );
}

function toTimelineEventsType(hit: TypesElasticSearchHit): TimelineEventsTypeForList {
  return {
    id: hit._id,
    title: hit.highlight ? hit.highlight.title[0] : hit._source.title,
  }
}

type InterestingAction = TypesComponentInitAction | SearchFieldInputAction;

export interface TypesGetSuccessAction extends Action {
  type: 'TYPES_GET_SUCCESS';
  payload: {
    name: string;
    results: TimelineEventsTypeForList[];
  }
}

export interface TypesGetErrorAction extends Action {
  type: 'TYPES_GET_ERROR';
  payload: {
    name: string;
    error: Error;
  };
}
