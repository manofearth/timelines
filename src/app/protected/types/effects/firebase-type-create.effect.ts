import { Injectable } from '@angular/core';
import { TypeCreateErrorAction, TypeCreateSuccessAction } from '../type-create-actions';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';
import { FirebaseType, TypesFirebaseService } from '../types-firebase.service';
import { SearchFieldCreateAction } from '../../shared/search-field/search-field-actions';
import { TYPES_SEARCH_FIELD_NAME } from '../types.component';
import { actionNameIs } from '../../../shared/action-name-is.fn';
import { toType } from '../../type/effects/type-get.effect';
import { toError } from '../../shared/firebase/protected-firebase.effect';

@Injectable()
export class FirebaseTypeCreateEffect {

  @Effect() effect = this.actions
    .ofType('SEARCH_FIELD_CREATE')
    .filter<SearchFieldCreateAction>(actionNameIs(TYPES_SEARCH_FIELD_NAME))
    .switchMap((action: SearchFieldCreateAction): Observable<TypeCreateSuccessAction | TypeCreateErrorAction> =>
      this.fireTypes
        .pushObject({
          title: action.payload.value,
          kind: 'period',
        })
        .switchMap(ref => this.fireTypes.getObject(ref.key).first<FirebaseType>())
        .map((fireType: FirebaseType): TypeCreateSuccessAction => ({
          type: 'TYPE_CREATE_SUCCESS',
          payload: toType(fireType)
        }))
        .catch(err => Observable.of<TypeCreateErrorAction>({
          type: 'TYPE_CREATE_ERROR',
          payload: toError(err),
        }))
    );

  constructor(
    private actions: Actions,
    private fireTypes: TypesFirebaseService,
  ) {
  }
}
