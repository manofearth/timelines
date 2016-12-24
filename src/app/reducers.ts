import { ActionReducer, combineReducers, Action } from '@ngrx/store';
import { authReducer, AuthState } from './auth/auth.reducer';
import { compose } from '@ngrx/core/compose';
import { storeFreeze } from 'ngrx-store-freeze';
import { timelinesReducer, TimelinesState } from './protected/timelines/timelines.reducer';
import { environment } from '../environments/environment';
import { TimelineState, timelineReducer } from './protected/timeline/timeline.reducer';

export interface AppState {
  auth: AuthState,
  timelines: TimelinesState,
  timeline: TimelineState,
}

export const initialState: AppState = {
  auth: {
    isLoading: true,
    error: null,
    user: null,
  },
  timelines: {
    isLoading: true,
    error: null,
    newTimelineId: null,
    timelines: null,
  },
  timeline: {
    isLoading: true,
    isSaving: false,
    error: null,
    timeline: null,
  }
};

interface AppReducers {
  auth: ActionReducer<AuthState>;
  timelines: ActionReducer<TimelinesState>;
  timeline: ActionReducer<TimelineState>;
}

const reducers: AppReducers = {
  auth: authReducer,
  timelines: timelinesReducer,
  timeline: timelineReducer,
};

const developmentReducer: ActionReducer<AppState> = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<AppState> = combineReducers(reducers);

export function reducer(state: AppState, action: Action) {
  if (environment.production) {
    return productionReducer(state, action);
  }
  else {
    return developmentReducer(state, action);
  }
}
