import { TimelineEvent } from '../shared/timeline-event';
import { Action } from '@ngrx/store';

export interface EventState {
  isSaving: boolean;
  event: TimelineEvent;
}

export type EventActionType = 'EVENT_CREATE' | 'EVENT_UPDATE' | 'EVENT_UPDATE_SUCCESS' | 'EVENT_UPDATE_ERROR';

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
    default:
      return state;
  }
}
