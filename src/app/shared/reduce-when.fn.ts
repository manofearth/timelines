import { Action, ActionReducer } from '@ngrx/store';

export function reduceWhen<TState>(
  filter: (action: Action) => boolean,
  reducer: ActionReducer<TState>
): ActionReducer<TState> {

  return (state: TState, action: Action) => {
    if (filter(action)) {
      reducer(state, action);
    } else {
      return state;
    }
  }
}
