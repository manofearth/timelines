import { Action } from '@ngrx/store';
import { TimelineEventForList } from '../shared/timeline-event';

export interface Timeline {
  id: string;
  title: string;
  events: TimelineEventForList[];
}

export interface TimelineForList {
  id: string;
  title: string;
}

export interface TimelineChangedPayload {
  id: string;
  title: string;
}

export interface TimelineState {
  isLoading: boolean;
  isSaving: boolean;
  error: Error;
  timeline: Timeline;
}

export type TimelineActionType = 'TIMELINE_GET' | 'TIMELINE_GET_SUCCESS' | 'TIMELINE_GET_ERROR'
  | 'TIMELINE_CHANGED' | 'TIMELINE_SAVE_SUCCESS' | 'TIMELINE_SAVE_ERROR';

export interface TimelineActionBase extends Action {
  type: TimelineActionType;
}

export interface TimelineGetAction extends TimelineActionBase {
  type: 'TIMELINE_GET';
  payload: string; // id
}

export interface TimelineGetSuccessAction extends TimelineActionBase {
  type: 'TIMELINE_GET_SUCCESS';
  payload: Timeline;
}

export interface TimelineGetErrorAction extends TimelineActionBase {
  type: 'TIMELINE_GET_ERROR';
  payload: Error;
}

export interface TimelineChangedAction extends TimelineActionBase {
  type: 'TIMELINE_CHANGED';
  payload: TimelineChangedPayload;
}

export interface TimelineSaveSuccessAction extends TimelineActionBase {
  type: 'TIMELINE_SAVE_SUCCESS';
}

export interface TimelineSaveErrorAction extends TimelineActionBase {
  type: 'TIMELINE_SAVE_ERROR';
  payload: Error;
}

export type TimelineAction = TimelineGetAction | TimelineGetSuccessAction | TimelineGetErrorAction
  | TimelineChangedAction | TimelineSaveSuccessAction | TimelineSaveErrorAction;

export function timelineReducer(state: TimelineState, action: TimelineAction): TimelineState {
  switch (action.type) {
    case 'TIMELINE_GET_SUCCESS':
      return {
        isLoading: false,
        isSaving: false,
        error: null,
        timeline: action.payload,
      };
    case 'TIMELINE_GET_ERROR':
      return {
        isLoading: false,
        isSaving: false,
        error: action.payload,
        timeline: state.timeline,
      };
    case 'TIMELINE_CHANGED':
      return {
        isLoading: state.isLoading,
        isSaving: true,
        error: null,
        timeline: { ...state.timeline, ...action.payload },
      };
    case 'TIMELINE_SAVE_SUCCESS':
      return {
        isLoading: state.isLoading,
        isSaving: false,
        error: null,
        timeline: state.timeline,
      };
    case 'TIMELINE_SAVE_ERROR':
      return {
        isLoading: state.isLoading,
        isSaving: false,
        error: action.payload,
        timeline: state.timeline,
      };
    default:
      return state;
  }
}
