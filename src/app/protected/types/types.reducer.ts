import { TimelineEventsTypeForList, TypesState } from './types-states';
import { TypesGetAction, TypesGetErrorAction, TypesGetSuccessAction } from './types-get-actions';
import { TypeGetSuccessAction } from '../type/type-get-actions';
import { TimelineEventsType } from '../type/type-states';
import { TypeCreateSuccessAction } from './type-create-actions';

type TypesAction = TypesGetAction | TypesGetSuccessAction | TypesGetErrorAction | TypeGetSuccessAction
  | TypeCreateSuccessAction;

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
    case 'TYPE_GET_SUCCESS':

      let haveTypeFound = false;
      const newTypes = state.types.map(type => {
        if (type.id === action.payload.id) {
          haveTypeFound = true;
          return extractTypeForList(action.payload);
        } else {
          return type;
        }
      });

      if (haveTypeFound) {
        return {
          ...state,
          types: newTypes,
        }
      } else {
        return state;
      }
    case 'TYPE_CREATE_SUCCESS':
      return {
        ...state,
        types: [
          ...state.types,
          extractTypeForList(action.payload)
        ],
      };
    default:
      return state;
  }
}

function extractTypeForList(type: TimelineEventsType): TimelineEventsTypeForList {
  return {
    id: type.id,
    title: type.title,
  }
}
