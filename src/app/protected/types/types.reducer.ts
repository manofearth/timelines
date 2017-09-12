import { TimelineEventsTypeLight, typesInitialState, TypesState } from './types-states';
import { TypesSearchErrorAction, TypesSearchSuccessAction } from './effects/types-algolia-search.effect';
import { TypeGetSuccessAction } from '../type/type-get-actions';
import { TimelineEventsType } from '../type/type-states';
import { TypeCreateSuccessAction } from './type-create-actions';
import { TYPES_COMPONENT_NAME, TYPES_SEARCH_FIELD_NAME } from './types.component';
import { SearchFieldInputAction } from '../shared/search-field/search-field-actions';
import { ComponentInitAction } from '../../shared/component-init-action';
import { TypeDeleteSuccessAction } from '../type/effects/type-delete.effect';
import { TypeUpdateAction } from '../type/type-update-actions';
import { AlgoliaType } from '../shared/algolia/algolia-search.service';

type TypesAction = ComponentInitAction | TypesSearchSuccessAction | TypesSearchErrorAction | TypeGetSuccessAction
  | TypeCreateSuccessAction | SearchFieldInputAction | TypeDeleteSuccessAction | TypeUpdateAction;

export function typesReducer(state: TypesState, action: TypesAction): TypesState {
  switch (action.type) {
    case 'COMPONENT_INIT':
      if (action.payload.name === TYPES_COMPONENT_NAME) {
        return typesInitialState;
      } else {
        return state;
      }
    case 'SEARCH_FIELD_INPUT':
      if (action.payload.name === TYPES_SEARCH_FIELD_NAME) {
        return {
          ...state,
          isSearching: true,
          query: action.payload.value,
        }
      }
      return state;
    case 'TYPES_SEARCH_SUCCESS':
      if (action.payload.name !== TYPES_COMPONENT_NAME && action.payload.name !== TYPES_SEARCH_FIELD_NAME) {
        return state;
      }
      return {
        ...state,
        isLoading: false,
        isSearching: false,
        error: null,
        types: action.payload.result.hits.map(toTimelineEventsType),
      };
    case 'TYPES_SEARCH_ERROR':
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
      return replaceType(state, action.payload.id, extractTypeForList(action.payload));
    case 'TYPE_UPDATE':
      return replaceType(state, action.payload.id, {
        id: action.payload.id,
        title: action.payload.data.title,
        kind: action.payload.data.kind,
      });
    case 'TYPE_CREATE_SUCCESS':
      return {
        ...state,
        types: [
          ...state.types,
          extractTypeForList(action.payload)
        ],
      };
    case 'TYPE_DELETE_SUCCESS':

      const typeToDelete = state.types.find(type => type.id === action.payload.id);

      if (typeToDelete === undefined) {
        return state;
      } else {
        return {
          ...state,
          types: state.types.filter(type => type !== typeToDelete),
        }
      }
    default:
      return state;
  }
}

function replaceType(state: TypesState, typeId: string, newType: TimelineEventsTypeLight): TypesState {
  let haveTypeFound = false;
  const newTypes = state.types.map(type => {
    if (type.id === typeId) {
      haveTypeFound = true;
      return newType;
    } else {
      return type;
    }
  });

  if (haveTypeFound) {
    return {
      ...state,
      types: newTypes,
    };
  } else {
    return state;
  }
}

function extractTypeForList(type: TimelineEventsType): TimelineEventsTypeLight {
  return {
    id: type.id,
    title: type.title,
    kind: type.kind,
  }
}

function toTimelineEventsType(hit: AlgoliaType): TimelineEventsTypeLight {
  return {
    id: hit.objectID,
    title: hit._highlightResult.title.value,
    kind: hit.kind,
  }
}
