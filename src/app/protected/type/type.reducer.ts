import { TypeGetAction, TypeGetErrorAction, TypeGetSuccessAction } from './type-get-actions';
import { initialTypeState, TypeState } from './type-states';
import { TypeUpdateAction, TypeUpdateErrorAction, TypeUpdateSuccessAction } from './type-update-actions';
import { TypeEraseAction } from './type-erase-action';
import { TypeDeleteButtonAction } from './type.component';
import { TypeCreateErrorAction, TypeCreateSuccessAction } from '../types/type-create-actions';
import { TypeDeleteSuccessAction } from './effects/type-delete.effect';

type TypeAction = TypeGetAction | TypeGetSuccessAction | TypeGetErrorAction | TypeUpdateAction
  | TypeUpdateSuccessAction | TypeUpdateErrorAction | TypeEraseAction | TypeDeleteButtonAction
  | TypeCreateSuccessAction | TypeCreateErrorAction | TypeDeleteSuccessAction;

export function typeReducer(state: TypeState, action: TypeAction): TypeState {
  switch (action.type) {
    case 'TYPE_GET':
      return {
        ...state,
        status: 'loading',
      };
    case 'TYPE_GET_SUCCESS':
    case 'TYPE_CREATE_SUCCESS':
      return {
        status: 'idle',
        error: null,
        type: action.payload,
      };
    case 'TYPE_GET_ERROR':
    case 'TYPE_CREATE_ERROR':
      return {
        ...state,
        status: 'error',
        error: action.payload,
      };
    case 'TYPE_UPDATE':
      return {
        ...state,
        status: 'updating',
      };
    case 'TYPE_UPDATE_SUCCESS':
    case 'TYPE_DELETE_SUCCESS':
      return {
        ...state,
        status: 'idle',
      };
    case 'TYPE_UPDATE_ERROR':
      return {
        ...state,
        status: 'error',
        error: action.payload,
      };
    case 'TYPE_DELETE_BUTTON':
      return {
        ...state,
        status: 'deleting',
      };
    case 'TYPE_ERASE':
      return initialTypeState;
    default:
      return state;
  }
}
