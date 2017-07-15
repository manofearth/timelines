import { TypesState } from './types-states';
import { TypesGetSuccessAction } from './types-get-actions';

type EventTypeAction = TypesGetSuccessAction;

export function typesReducer(state: TypesState, action: EventTypeAction): TypesState {
  switch (action.type) {
    case 'TYPES_GET_SUCCESS':
      return {
        isLoading: false,
        error: null,
        types: action.payload,
      };
    default:
      return state;
  }
}
