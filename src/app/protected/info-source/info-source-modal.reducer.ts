import { INFO_SOURCES_LIST_SEARCH_FIELD_NAME } from '../info-sources/info-sources-list.component';
import { actionNameIs } from '../../shared/action-name-is.fn';
import { SearchFieldCreateAction } from '../shared/search-field/search-field-actions';
import { InputChangedAction } from '../shared/input/input.directive';
import { INFO_SOURCE_MODAL_TITLE_INPUT_NAME } from './info-source-modal.component';
import { setToObj } from '../../shared/helpers';
import {
  InfoSourceFirebaseGetErrorAction,
  InfoSourceFirebaseGetSuccessAction
} from './effects/info-source-firebase-get.effect';
import { NavigatedToInfoSourceAction } from '../info-sources/effects/info-sources-router.effect';

export interface InfoSourceModalState {
  status: InfoSourceModalStatus;
  error: Error | null;
  infoSource: InfoSource;
}

export interface InfoSource {
  id: string;
  title: string;
}

export type InfoSourceModalStatus =
  'NEW'
  | 'ERROR'
  | 'LOADING'
  | 'LOADED'
  ;

export const infoSourceModalInitialState: InfoSourceModalState = {
  status: 'NEW',
  error: null,
  infoSource: newInfoSource(''),
};

export function newInfoSource(title: string): InfoSource {
  return {
    id: null,
    title: title,
  }
}

type InfoSourceModalReducerAction =
  SearchFieldCreateAction
  | InputChangedAction
  | InfoSourceFirebaseGetSuccessAction
  | InfoSourceFirebaseGetErrorAction
  | NavigatedToInfoSourceAction
  ;

export function infoSourceModalReducer(
  state: InfoSourceModalState, action: InfoSourceModalReducerAction
): InfoSourceModalState {

  switch (action.type) {
    case 'SEARCH_FIELD_CREATE':
      if (actionNameIs(INFO_SOURCES_LIST_SEARCH_FIELD_NAME)(action)) {
        return {
          ...state,
          infoSource: newInfoSource(action.payload.value)
        };
      }
      return state;
    case 'INPUT_CHANGED':
      switch (action.payload.name) {
        case INFO_SOURCE_MODAL_TITLE_INPUT_NAME:
          return {
            ...state,
            infoSource: setToObj(state.infoSource, 'title', action.payload.value),
          };
        default:
          return state;
      }
    case 'INFO_SOURCE_FIREBASE_GET_SUCCESS':
      if (action.payload.infoSource.$exists()) {
        return {
          ...state,
          status: 'LOADED',
          infoSource: {
            id: action.payload.infoSource.$key,
            title: action.payload.infoSource.title,
          }
        };
      } else {
        return {
          ...state,
          status: 'ERROR',
          infoSource: newInfoSource(''),
        }
      }
    case 'INFO_SOURCE_FIREBASE_GET_ERROR':
      return {
        ...state,
        error: action.payload.error,
      };
    case 'NAVIGATED_TO_INFO_SOURCE':
      return {
        ...state,
        status: 'LOADING',
      };
    default:
      return state;
  }
}
