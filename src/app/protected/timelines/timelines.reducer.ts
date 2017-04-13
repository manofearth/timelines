import { Action } from '@ngrx/store';
import { Timeline, TimelineForList } from '../timeline/timeline.reducer';

export interface TimelinesState {
  isLoading: boolean;
  error: Error;
  newTimelineId: string;
  timelines: TimelineForList[];
}

export type TimelinesActionType = 'TIMELINES_GET' | 'TIMELINES_GET_SUCCESS'
  | 'TIMELINES_GET_ERROR' | 'TIMELINES_CREATE' | 'TIMELINES_CREATE_SUCCESS'
  | 'TIMELINES_CREATE_ERROR' | 'TIMELINES_DELETE' | 'TIMELINES_DELETE_SUCCESS'
  | 'TIMELINES_DELETE_ERROR';

export interface TimelinesActionBase extends Action {
  type: TimelinesActionType;
}

export interface TimelinesGetAction extends TimelinesActionBase {
  type: 'TIMELINES_GET';
}

export interface TimelinesGetSuccessAction extends TimelinesActionBase {
  type: 'TIMELINES_GET_SUCCESS';
  payload: TimelineForList[];
}

export interface TimelinesGetErrorAction extends TimelinesActionBase {
  type: 'TIMELINES_GET_ERROR';
  payload: Error;
}

export interface TimelinesCreateAction extends TimelinesActionBase {
  type: 'TIMELINES_CREATE';
}

export interface TimelinesCreateSuccessAction extends TimelinesActionBase {
  type: 'TIMELINES_CREATE_SUCCESS';
  payload: string;
}

export interface TimelinesCreateErrorAction extends TimelinesActionBase {
  type: 'TIMELINES_CREATE_ERROR';
  payload: Error;
}

export interface TimelinesDeleteAction extends TimelinesActionBase {
  type: 'TIMELINES_DELETE';
  payload: Timeline;
}

export interface TimelinesDeleteSuccessAction extends TimelinesActionBase {
  type: 'TIMELINES_DELETE_SUCCESS';
}

export interface TimelinesDeleteErrorAction extends TimelinesActionBase {
  type: 'TIMELINES_DELETE_ERROR';
  payload: Error;
}

export type TimelinesAction = TimelinesGetAction | TimelinesGetSuccessAction | TimelinesGetErrorAction
  | TimelinesGetAction | TimelinesCreateAction | TimelinesCreateSuccessAction | TimelinesCreateErrorAction
  | TimelinesDeleteAction | TimelinesDeleteSuccessAction | TimelinesDeleteErrorAction;

export function timelinesReducer(state: TimelinesState, action: TimelinesAction): TimelinesState {
  switch (action.type) {
    case 'TIMELINES_GET_SUCCESS':
      return {
        isLoading: false,
        error: null,
        newTimelineId: null,
        timelines: action.payload,
      };
    case 'TIMELINES_GET_ERROR':
      return {
        isLoading: false,
        error: action.payload,
        newTimelineId: null,
        timelines: state.timelines,
      };
    case 'TIMELINES_CREATE_SUCCESS':
      return {
        isLoading: false,
        error: null,
        newTimelineId: action.payload,
        timelines: state.timelines,
      };
    case 'TIMELINES_CREATE_ERROR':
      return {
        isLoading: false,
        error: action.payload,
        newTimelineId: null,
        timelines: state.timelines,
      };
    case 'TIMELINES_DELETE_SUCCESS':
      return {
        isLoading: false,
        error: null,
        newTimelineId: null,
        timelines: state.timelines,
      };
    case 'TIMELINES_DELETE_ERROR':
      return {
        isLoading: false,
        error: action.payload,
        newTimelineId: null,
        timelines: state.timelines,
      };
    default:
      return state;
  }
}
