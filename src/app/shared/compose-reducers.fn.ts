import { Action, ActionReducer } from '@ngrx/store';

export function composeReducers<TState>(...reducers: ActionReducer<TState>[]): ActionReducer<TState> {
  return (state: TState, action: Action) =>
    reducers.reduceRight(
      (state, reducer) => reducer(state, action),
      state
    );
}
