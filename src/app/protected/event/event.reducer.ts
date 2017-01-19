import { TimelineEvent } from '../shared/timeline-event';
import { Action } from '@ngrx/store';

export interface EventState {
  event: TimelineEvent;
}

export type EventActionType = 'EVENT_CREATE';

export interface EventAction extends Action {
  type: EventActionType;
}

export interface EventCreateAction extends EventAction {
    type: 'EVENT_CREATE';
    payload: string;
}

export function eventReducer(state: EventState, action: EventAction): EventState {

  switch (action.type) {
    case 'EVENT_CREATE':
      return {
        event: {
          title: action.payload,
          dateBegin: null,
          dateEnd: null,
        },
      };
    default:
      return state;
  }
}
