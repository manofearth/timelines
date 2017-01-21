import { TimelineEvent } from '../shared/timeline-event';
import { Action } from '@ngrx/store';

export interface EventState {
  isSaving: boolean;
  event: TimelineEvent;
}

export type EventActionType = 'EVENT_CREATE' | 'EVENT_SAVE' | 'EVENT_SAVE_SUCCESS' | 'EVENT_SAVE_ERROR';

export interface EventAction extends Action {
  type: EventActionType;
}

export interface EventCreateAction extends EventAction {
    type: 'EVENT_CREATE';
    payload: string;
}

export interface EventSaveAction extends EventAction {
  type: 'EVENT_SAVE';
  payload: TimelineEvent;
}

export interface EventSaveSuccessAction extends EventAction {
  type: 'EVENT_SAVE_SUCCESS';
}

export interface EventSaveErrorAction extends EventAction {
  type: 'EVENT_SAVE_ERROR';
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
