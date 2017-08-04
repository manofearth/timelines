import { Action } from '@ngrx/store';

export interface ComponentInitAction extends Action {
  type: 'COMPONENT_INIT';
  payload: {
    name: string;
  }
}
