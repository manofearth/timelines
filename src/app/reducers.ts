import { Action, ActionReducer, combineReducers } from '@ngrx/store';
import { authReducer, AuthState } from './auth/auth.reducer';
import { compose } from '@ngrx/core/compose';
import { storeFreeze } from 'ngrx-store-freeze';
import { timelinesReducer, TimelinesState } from './protected/timelines/timelines.reducer';
import { environment } from '../environments/environment';
import { timelineStateReducer } from './protected/timeline/timeline-state.reducer';
import { eventStateReducer } from './protected/event/reducers/event-state.reducer';
import { timelineInitialState, TimelineState } from './protected/timeline/timeline-states';
import { eventInitialState, EventState } from './protected/event/event-states';
import { typesInitialState, TypesState } from './protected/types/types-states';
import { typesReducer } from './protected/types/types.reducer';
import { initialTypeState, TypeState } from './protected/type/type-states';
import { typeReducer } from './protected/type/type.reducer';

export interface AppState {
  auth: AuthState;
  timelines: TimelinesState;
  timeline: TimelineState;
  event: EventState;
  types: TypesState;
  type: TypeState;
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
  timeline: timelineInitialState,
  event: eventInitialState,
  types: typesInitialState,
  type: initialTypeState,
};

export type Reducers<TState> = {
  [K in keyof TState]: ActionReducer<TState[K]>
}

const reducers: Reducers<AppState> = {
  auth: authReducer,
  timelines: timelinesReducer,
  timeline: timelineStateReducer,
  event: eventStateReducer,
  types: typesReducer,
  type: typeReducer,
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
