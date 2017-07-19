import { TypesState } from './types-states';
import { TypesGetAction, TypesGetErrorAction, TypesGetSuccessAction } from './types-get-actions';

type TypesAction = TypesGetAction | TypesGetSuccessAction | TypesGetErrorAction;

export function typesReducer(state: TypesState, action: TypesAction): TypesState {
  switch (action.type) {
    case 'TYPES_GET':
      return {
        ...state,
        isLoading: true,
      };
    case 'TYPES_GET_SUCCESS':
      return {
        isLoading: false,
        error: null,
        types: action.payload,
      };
    case 'TYPES_GET_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
