import { TypeGetAction, TypeGetErrorAction, TypeGetSuccessAction } from './type-get-actions';
import { TypeState } from './type-states';

type TypeAction = TypeGetAction | TypeGetSuccessAction | TypeGetErrorAction;

export function typeReducer(state: TypeState, action: TypeAction): TypeState {
  switch (action.type) {
    case 'TYPE_GET':
      return {
        ...state,
        isLoading: true,
      };
    case 'TYPE_GET_SUCCESS':
      return {
        isLoading: false,
        error: null,
        type: action.payload,
      };
    case 'TYPE_GET_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
