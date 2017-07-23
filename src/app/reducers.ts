import { ActionReducer, combineReducers, Action } from '@ngrx/store';
import { authReducer, AuthState } from './auth/auth.reducer';
import { compose } from '@ngrx/core/compose';
import { storeFreeze } from 'ngrx-store-freeze';
import { timelinesReducer, TimelinesState } from './protected/timelines/timelines.reducer';
import { environment } from '../environments/environment';
import { timelineReducer } from './protected/timeline/timeline.reducer';
import { eventReducer } from './protected/event/event.reducer';
import { TimelineState } from './protected/timeline/timeline-states';
import { EventState } from './protected/event/event-states';
import { TypesState } from './protected/types/types-states';
import { typesReducer } from './protected/types/types.reducer';
import { initialTypeState, TypeState } from './protected/type/type-states';
import { typeReducer } from './protected/type/type.reducer';
import { selectorsReducer } from './protected/shared/selector-input/selector.reducer';

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
  timeline: {
    isLoading: true,
    isSaving: false,
    error: null,
    timeline: null,
    currentGroupIndex: 0,
  },
  event: {
    status: null,
    error: null,
    event: null,
  },
  types: {
    isLoading: true,
    error: null,
    types: [],
  },
  type: initialTypeState,
};

interface AppReducers {
  auth: ActionReducer<AuthState>;
  timelines: ActionReducer<TimelinesState>;
  timeline: ActionReducer<TimelineState>;
  event: ActionReducer<EventState>;
  types: ActionReducer<TypesState>;
  type: ActionReducer<TypeState>;
  selectors: ActionReducer<TypeState>;
}

const reducers: AppReducers = {
  auth: authReducer,
  timelines: timelinesReducer,
  timeline: timelineReducer,
  event: eventReducer,
  types: typesReducer,
  type: typeReducer,
  selectors: selectorsReducer,
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
