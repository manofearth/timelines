import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { TypesElasticSearchHit, TypesElasticSearchService } from '../types-elastic-search.service';
import { TimelineEventsTypeForList } from '../types-states';
import { SearchFieldInputAction } from '../../shared/search-field/search-field-actions';
import { Action } from '@ngrx/store';
import { TYPES_SEARCH_FIELD_NAME, TypesComponentInitAction } from '../types.component';
import { toError } from '../../shared/firebase/protected-firebase.effect';

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
      || action.type === 'SEARCH_FIELD_INPUT' && action.payload.name === TYPES_SEARCH_FIELD_NAME
    )
    .map<InterestingAction, string | null>(action => {
      if (action.type === 'TYPES_COMPONENT_INIT') {
        return null; // no search query
      } else {
        return action.payload.value;
      }
    })
    .switchMap(query =>
      this.elasticSearchTypes
        .search(query)
        .map(searchResult => ({
          type: 'TYPES_GET_SUCCESS' as 'TYPES_GET_SUCCESS',
          payload: searchResult.hits.hits.map(toTimelineEventsType),
        }))
        .catch(err => Observable.of({
          type: 'TYPES_GET_ERROR' as 'TYPES_GET_ERROR',
          payload: toError(err),
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
  payload: TimelineEventsTypeForList[];
}

export interface TypesGetErrorAction extends Action {
  type: 'TYPES_GET_ERROR';
  payload: Error;
}
