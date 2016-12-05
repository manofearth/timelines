import { ActionReducer, combineReducers } from '@ngrx/store';
import { authReducer, AuthState } from './auth.reducer';
import { compose } from '@ngrx/core/compose';
import { storeFreeze } from 'ngrx-store-freeze';

export interface AppState {
  auth: AuthState,
}

export const initialState: AppState = {
  auth: {
    isLoading: true,
    error: null,
    user: null,
  }
};

interface AppReducers {
  auth: ActionReducer<AuthState>;
}

const reducers: AppReducers = {
  auth: authReducer,
};

export const developmentReducer: ActionReducer<AppState> = compose(storeFreeze, combineReducers)(reducers);
export const productionReducer: ActionReducer<AppState> = combineReducers(reducers);
