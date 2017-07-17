import { Injectable } from '@angular/core';
import { AuthFirebaseService } from '../../shared/firebase/auth-firebase.service';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { TypesGetAction, TypesGetErrorAction, TypesGetSuccessAction } from '../types-get-actions';
import { ProtectedFirebaseEffect } from '../../shared/firebase/protected-firebase.effect';
import {
  TypesElasticSearchHit,
  TypesElasticSearchResponse,
  TypesElasticSearchService
} from '../types-elastic-search.service';
import { TimelineEventsTypeForList } from '../types-states';

@Injectable()
export class ElasticTypesGetEffect extends ProtectedFirebaseEffect<TypesGetAction,
  TypesGetSuccessAction,
  TypesGetErrorAction,
  TypesElasticSearchResponse> {

  constructor(
    actions: Actions,
    auth: AuthFirebaseService,
    private elasticSearchTypes: TypesElasticSearchService,
  ) {
    super(actions, auth);
  }

  @Effect()
  effect(): Observable<TypesGetSuccessAction | TypesGetErrorAction> {
    return super.createEffect();
  }

  protected runEffect(action: TypesGetAction): Observable<TypesElasticSearchResponse> {
    return this.elasticSearchTypes
      .search(action.payload);
  }

  protected mapToSuccessAction(searchResult: TypesElasticSearchResponse): TypesGetSuccessAction {
    return {
      type: 'TYPES_GET_SUCCESS',
      payload: searchResult.hits.hits.map(toTimelineEventsType),
    };
  }

  protected getInterestedActionType(): 'TYPES_GET' {
    return 'TYPES_GET';
  }

  protected getErrorActionType(): 'TYPES_GET_ERROR' {
    return 'TYPES_GET_ERROR';
  }
}

function toTimelineEventsType(hit: TypesElasticSearchHit): TimelineEventsTypeForList {
  return {
    id: hit._id,
    title: hit.highlight ? hit.highlight.title[0] : hit._source.title,
  }
}
