import { TimelineEvent } from '../shared/timeline-event';
import { Action } from '@ngrx/store';

export interface EventState {
  isSaving: boolean;
  event: TimelineEvent;
}

export type EventActionType = 'EVENT_CREATE' | 'EVENT_UPDATE' | 'EVENT_UPDATE_SUCCESS' | 'EVENT_UPDATE_ERROR'
  | 'EVENT_INSERT' | 'EVENT_INSERT_SUCCESS' | 'EVENT_INSERT_ERROR';

export interface EventAction extends Action {
  type: EventActionType;
}

export interface EventCreateAction extends EventAction {
    type: 'EVENT_CREATE';
    payload: string;
}

export interface EventUpdateAction extends EventAction {
  type: 'EVENT_UPDATE';
  payload: TimelineEvent;
}

export interface EventUpdateSuccessAction extends EventAction {
  type: 'EVENT_UPDATE_SUCCESS';
}

export interface EventUpdateErrorAction extends EventAction {
  type: 'EVENT_UPDATE_ERROR';
  payload: Error;
}

export interface EventInsertAction extends EventAction {
  type: 'EVENT_INSERT';
  payload: TimelineEvent;
}

export interface EventInsertSuccessAction extends EventAction {
  type: 'EVENT_INSERT_SUCCESS';
}

export interface EventInsertErrorAction extends EventAction {
  type: 'EVENT_INSERT_ERROR';
  payload: Error;
}

export function eventReducer(state: EventState, action: EventAction): EventState {

  switch (action.type) {
    case 'EVENT_CREATE':
      return {
        isSaving: false,
        event: {
          id: null,
          title: action.payload,
          dateBegin: null,
          dateEnd: null,
        },
      };
    case 'EVENT_UPDATE':
      return {
        isSaving: true,
        event: state.event,
      };
    default:
      return state;
  }
}
