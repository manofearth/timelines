import { Action } from '@ngrx/store';
import { Timeline, TimelineForList } from '../timeline/timeline-states';

export interface TimelinesState {
  isLoading: boolean;
  error: Error;
  newTimelineId: string;
  timelines: TimelineForList[];
}

export type TimelinesActionType = 'TIMELINES_GET' | 'TIMELINES_GET_SUCCESS'
  | 'TIMELINES_GET_ERROR' | 'TIMELINE_CREATE' | 'TIMELINE_CREATE_SUCCESS'
  | 'TIMELINE_CREATE_ERROR' | 'TIMELINE_DELETE' | 'TIMELINE_DELETE_SUCCESS'
  | 'TIMELINE_DELETE_ERROR';

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

export interface TimelineCreateAction extends TimelinesActionBase {
  type: 'TIMELINE_CREATE';
}

export interface TimelineCreateSuccessAction extends TimelinesActionBase {
  type: 'TIMELINE_CREATE_SUCCESS';
  payload: string;
}

export interface TimelineCreateErrorAction extends TimelinesActionBase {
  type: 'TIMELINE_CREATE_ERROR';
  payload: Error;
}

export interface TimelineDeleteAction extends TimelinesActionBase {
  type: 'TIMELINE_DELETE';
  payload: Timeline;
}

export interface TimelineDeleteSuccessAction extends TimelinesActionBase {
  type: 'TIMELINE_DELETE_SUCCESS';
}

export interface TimelineDeleteErrorAction extends TimelinesActionBase {
  type: 'TIMELINE_DELETE_ERROR';
  payload: Error;
}

export type TimelinesAction = TimelinesGetAction | TimelinesGetSuccessAction | TimelinesGetErrorAction
  | TimelinesGetAction | TimelineCreateAction | TimelineCreateSuccessAction | TimelineCreateErrorAction
  | TimelineDeleteAction | TimelineDeleteSuccessAction | TimelineDeleteErrorAction;

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
    case 'TIMELINE_DELETE_SUCCESS':
      return {
        isLoading: false,
        error: null,
        newTimelineId: null,
        timelines: state.timelines,
      };
    case 'TIMELINE_DELETE_ERROR':
      return {
        isLoading: false,
        error: action.payload,
        newTimelineId: null,
        timelines: state.timelines,
      };
    case 'TIMELINE_CREATE_SUCCESS':
      return {
        isLoading: false,
        error: null,
        newTimelineId: action.payload,
        timelines: state.timelines,
      };
    case 'TIMELINE_CREATE_ERROR':
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
