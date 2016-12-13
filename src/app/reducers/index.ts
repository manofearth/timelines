import { ActionReducer, combineReducers, Action } from '@ngrx/store';
import { authReducer, AuthState } from './auth.reducer';
import { compose } from '@ngrx/core/compose';
import { storeFreeze } from 'ngrx-store-freeze';
import { Timeline, timelinesReducer } from './timelines.reducer';
import { environment } from '../../environments/environment';

export interface AppState {
  auth: AuthState,
  timelines: Timeline[],
}

export const initialState: AppState = {
  auth: {
    isLoading: true,
    error: null,
    user: null,
  },
  timelines: null,
};

interface AppReducers {
  auth: ActionReducer<AuthState>;
  timelines: ActionReducer<Timeline[]>;
}

const reducers: AppReducers = {
  auth: authReducer,
  timelines: timelinesReducer,
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
