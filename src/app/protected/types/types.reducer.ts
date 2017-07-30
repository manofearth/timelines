import { TimelineEventsTypeForList, typesInitialState, TypesState } from './types-states';
import { TypesGetErrorAction, TypesGetSuccessAction } from './effects/elastic-types-get.effect';
import { TypeGetSuccessAction } from '../type/type-get-actions';
import { TimelineEventsType } from '../type/type-states';
import { TypeCreateSuccessAction } from './type-create-actions';
import { TYPES_COMPONENT_NAME, TYPES_SEARCH_FIELD_NAME, TypesComponentInitAction } from './types.component';
import { SearchFieldInputAction } from '../shared/search-field/search-field-actions';

type TypesAction = TypesComponentInitAction | TypesGetSuccessAction | TypesGetErrorAction | TypeGetSuccessAction
  | TypeCreateSuccessAction | SearchFieldInputAction;

export function typesReducer(state: TypesState, action: TypesAction): TypesState {
  switch (action.type) {
    case 'TYPES_COMPONENT_INIT':
      return typesInitialState;
    case 'SEARCH_FIELD_INPUT':
      if (action.payload.name === TYPES_SEARCH_FIELD_NAME) {
        return {
          ...state,
          isSearching: true,
        }
      }
      return state;
    case 'TYPES_GET_SUCCESS':
      if (action.payload.name !== TYPES_COMPONENT_NAME && action.payload.name !== TYPES_SEARCH_FIELD_NAME) {
        return state;
      }
      return {
        ...state,
        isLoading: false,
        isSearching: false,
        error: null,
        types: action.payload.results,
      };
    case 'TYPES_GET_ERROR':
      if (action.payload.name !== TYPES_COMPONENT_NAME && action.payload.name !== TYPES_SEARCH_FIELD_NAME) {
        return state;
      }
      return {
        ...state,
        isLoading: false,
        isSearching: false,
        error: action.payload.error,
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
        query: '',
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
