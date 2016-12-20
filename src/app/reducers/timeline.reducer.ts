import { Action } from '@ngrx/store';
export interface Timeline {
  id: string;
  title: string;
}

export interface TimelineState {
  isLoading: boolean;
  error: Error;
  timeline: Timeline;
}

export type TimelineActionType = 'ACTION_TIMELINE_GET' | 'ACTION_TIMELINE_GET_SUCCESS' | 'ACTION_TIMELINE_GET_ERROR';

export interface TimelineActionBase extends Action {
  type: TimelineActionType;
}

export interface TimelineGetAction extends TimelineActionBase {
  type: 'ACTION_TIMELINE_GET';
  payload: string;
}

export interface TimelineGetSuccessAction extends TimelineActionBase {
  type: 'ACTION_TIMELINE_GET_SUCCESS';
  payload: Timeline;
}

export interface TimelineGetErrorAction extends TimelineActionBase {
  type: 'ACTION_TIMELINE_GET_ERROR';
  payload: Error;
}

export type TimelineAction = TimelineGetAction | TimelineGetSuccessAction | TimelineGetErrorAction;

export function timelineReducer(state: TimelineState, action: TimelineAction): TimelineState {
  switch (action.type) {
    case 'ACTION_TIMELINE_GET_SUCCESS':
      return {
        isLoading: false,
        error: null,
        timeline: action.payload,
      };
    default:
      return state;
  }
}
