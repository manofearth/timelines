import { Action } from '@ngrx/store';

export interface Timeline {
  id: string;
  title: string;
}

type TimelinesActionType = 'ACTION_TIMELINES_GET' | 'ACTION_TIMELINES_GET_SUCCESS';

export interface TimelinesAction extends Action {
    type: TimelinesActionType;
}

export interface TimelinesGetAction extends TimelinesAction {
    type: 'ACTION_TIMELINES_GET';
}

export interface TimelinesGetSuccessAction extends TimelinesAction {
    type: 'ACTION_TIMELINES_GET_SUCCESS';
    payload: Timeline[];
}

export function timelinesReducer(state: Timeline[], action: TimelinesAction): Timeline[] {
    switch (action.type) {
      case 'ACTION_TIMELINES_GET_SUCCESS':
        return action.payload;
      default:
        return state;
    }
}
