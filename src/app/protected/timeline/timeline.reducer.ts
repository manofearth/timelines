import { Action } from '@ngrx/store';
import { TimelineFormValue } from './timeline.component';
export interface Timeline {
  id: string;
  title: string;
}

export interface TimelineState {
  isLoading: boolean;
  isSaving: boolean;
  error: Error;
  timeline: Timeline;
}

export type TimelineActionType = 'ACTION_TIMELINE_GET' | 'ACTION_TIMELINE_GET_SUCCESS' | 'ACTION_TIMELINE_GET_ERROR'
  | 'ACTION_TIMELINE_CHANGED' | 'ACTION_TIMELINE_SAVE_SUCCESS' | 'ACTION_TIMELINE_SAVE_ERROR';

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
  payload: Timeline;
}

export interface TimelineSaveSuccessAction extends TimelineActionBase {
  type: 'ACTION_TIMELINE_SAVE_SUCCESS';
}

export interface TimelineSaveErrorAction extends TimelineActionBase {
  type: 'ACTION_TIMELINE_SAVE_ERROR';
  payload: Error;
}

export type TimelineAction = TimelineGetAction | TimelineGetSuccessAction | TimelineGetErrorAction
  | TimelineChangedAction | TimelineSaveSuccessAction | TimelineSaveErrorAction;

export function timelineReducer(state: TimelineState, action: TimelineAction): TimelineState {
  switch (action.type) {
    case 'ACTION_TIMELINE_GET_SUCCESS':
      return {
        isLoading: false,
        isSaving: false,
        error: null,
        timeline: action.payload,
      };
    case 'ACTION_TIMELINE_GET_ERROR':
      return {
        isLoading: false,
        isSaving: false,
        error: action.payload,
        timeline: state.timeline,
      };
    case 'ACTION_TIMELINE_CHANGED':
      return {
        isLoading: false,
        isSaving: true,
        error: null,
        timeline: action.payload,
      };
    case 'ACTION_TIMELINE_SAVE_SUCCESS':
      return {
        isLoading: false,
        isSaving: false,
        error: null,
        timeline: state.timeline,
      };
    case 'ACTION_TIMELINE_SAVE_ERROR':
      return {
        isLoading: false,
        isSaving: false,
        error: action.payload,
        timeline: state.timeline,
      };
    default:
      return state;
  }
}
