import { Injectable } from '@angular/core';
import { AuthFirebaseService } from '../../shared/firebase/auth-firebase.service';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import { TypesGetAction, TypesGetErrorAction, TypesGetSuccessAction } from '../types-get-actions';
import { ProtectedFirebaseEffect } from '../../shared/firebase/protected-firebase.effect';
import { ElasticTypesService } from '../elastic-types.service';
import { SelectorSearchResultItem } from '../../shared/selector/selector-search-result-item';

@Injectable()
export class ElasticTypesGetEffect extends ProtectedFirebaseEffect<TypesGetAction,
  TypesGetSuccessAction,
  TypesGetErrorAction,
  SelectorSearchResultItem[]> {

  constructor(
    actions: Actions,
    auth: AuthFirebaseService,
    private elasticTypes: ElasticTypesService,
  ) {
    super(actions, auth);
  }

  @Effect()
  effect(): Observable<TypesGetSuccessAction | TypesGetErrorAction> {
    return super.createEffect();
  }

  protected runEffect(action: TypesGetAction): Observable<SelectorSearchResultItem[]> {
    return this.elasticTypes.search('ти');
  }

  protected mapToSuccessAction(types: SelectorSearchResultItem[]): TypesGetSuccessAction {
    return {
      type: 'TYPES_GET_SUCCESS',
      payload: types,
    };
  }

  protected getInterestedActionType(): 'TYPES_GET' {
    return 'TYPES_GET';
  }

  protected getErrorActionType(): 'TYPES_GET_ERROR' {
    return 'TYPES_GET_ERROR';
  }
}
