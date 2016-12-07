import { ActionReducer, combineReducers } from '@ngrx/store';
import { authReducer, AuthState } from './auth.reducer';
import { compose } from '@ngrx/core/compose';
import { storeFreeze } from 'ngrx-store-freeze';
import { Timeline, timelinesReducer } from './timelines.reducer';

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

export const developmentReducer: ActionReducer<AppState> = compose(storeFreeze, combineReducers)(reducers);
export const productionReducer: ActionReducer<AppState> = combineReducers(reducers);
