import { Action } from '@ngrx/store';

export interface TimelinesState {
  isLoading: boolean;
  error: Error;
  newTimelineId: string;
  timelines: Timeline[];
}

export interface Timeline {
  id: string;
  title: string;
}

export type TimelinesActionType = 'ACTION_TIMELINES_GET' | 'ACTION_TIMELINES_GET_SUCCESS'
  | 'ACTION_TIMELINES_GET_ERROR' | 'ACTION_TIMELINES_CREATE' | 'ACTION_TIMELINES_CREATE_SUCCESS'
  | 'ACTION_TIMELINES_CREATE_ERROR';

export interface TimelinesActionBase extends Action {
  type: TimelinesActionType;
}

export interface TimelinesGetAction extends TimelinesActionBase {
  type: 'ACTION_TIMELINES_GET';
}

export interface TimelinesGetSuccessAction extends TimelinesActionBase {
  type: 'ACTION_TIMELINES_GET_SUCCESS';
  payload: Timeline[];
}

export interface TimelinesGetErrorAction extends TimelinesActionBase {
  type: 'ACTION_TIMELINES_GET_ERROR';
  payload: Error;
}

export interface TimelinesCreateAction extends TimelinesActionBase {
  type: 'ACTION_TIMELINES_CREATE';
}

export interface TimelinesCreateSuccessAction extends TimelinesActionBase {
  type: 'ACTION_TIMELINES_CREATE_SUCCESS';
  payload: string;
}

export interface TimelinesCreateErrorAction extends TimelinesActionBase {
  type: 'ACTION_TIMELINES_CREATE_ERROR';
  payload: Error;
}

export type TimelinesAction = TimelinesGetAction | TimelinesGetSuccessAction | TimelinesGetErrorAction
  | TimelinesGetAction | TimelinesCreateAction | TimelinesCreateSuccessAction | TimelinesCreateErrorAction;

export function timelinesReducer(state: TimelinesState, action: TimelinesAction): TimelinesState {
  switch (action.type) {
    case 'ACTION_TIMELINES_GET_SUCCESS':
      return {
        isLoading: false,
        error: null,
        newTimelineId: null,
        timelines: action.payload,
      };
    case 'ACTION_TIMELINES_GET_ERROR':
      return {
        isLoading: false,
        error: action.payload,
        newTimelineId: null,
        timelines: state.timelines,
      };
    case 'ACTION_TIMELINES_CREATE_SUCCESS':
      return {
        isLoading: false,
        error: null,
        newTimelineId: action.payload,
        timelines: state.timelines,
      };
    case 'ACTION_TIMELINES_CREATE_ERROR':
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
