import { INFO_SOURCES_LIST_SEARCH_FIELD_NAME } from '../info-sources/info-sources-list.component';
import { actionNameIs } from '../../shared/action-name-is.fn';
import { SearchFieldCreateAction } from '../shared/search-field/search-field-actions';

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
  | 'INSERTING'
  | 'INSERTED'
  | 'UPDATING'
  | 'UPDATED'
  | 'ERROR'
  | 'LOADING'
  | 'LOADED'
  | 'DELETING'
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
    default:
      return state;
  }
}
