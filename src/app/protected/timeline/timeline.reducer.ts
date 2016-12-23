import { Action } from '@ngrx/store';
import { TimelineFormValue } from './timeline.component';
export interface Timeline {
  id: string;
  title: string;
}

export interface TimelineState {
  isLoading: boolean;
  error: Error;
  timeline: Timeline;
}

export type TimelineActionType = 'ACTION_TIMELINE_GET' | 'ACTION_TIMELINE_GET_SUCCESS' | 'ACTION_TIMELINE_GET_ERROR'
  | 'ACTION_TIMELINE_CHANGED';

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

export interface TimelineChangedAction extends TimelineActionBase {
  type: 'ACTION_TIMELINE_CHANGED';
  payload: TimelineFormValue;
}

export type TimelineAction = TimelineGetAction | TimelineGetSuccessAction | TimelineGetErrorAction
  | TimelineChangedAction;

export function timelineReducer(state: TimelineState, action: TimelineAction): TimelineState {
  switch (action.type) {
    case 'ACTION_TIMELINE_GET_SUCCESS':
      return {
        isLoading: false,
        error: null,
        timeline: action.payload,
      };
    case 'ACTION_TIMELINE_GET_ERROR':
      return {
        isLoading: false,
        error: action.payload,
        timeline: state.timeline,
      };
    default:
      return state;
  }
}
