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

export  type TimelinesActionType = 'ACTION_TIMELINES_GET' | 'ACTION_TIMELINES_GET_SUCCESS'
  | 'ACTION_TIMELINES_GET_ERROR';

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

export type TimelinesAction = TimelinesGetAction | TimelinesGetSuccessAction | TimelinesGetAction;

export function timelinesReducer(state: TimelinesState, action: TimelinesAction): TimelinesState {
    switch (action.type) {
      case 'ACTION_TIMELINES_GET_SUCCESS':
        return {
          isLoading: false,
          error: null,
          newTimelineId: null,
          timelines: action.payload,
        };
      default:
        return state;
    }
}
