import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import { spliceOneValue } from '../../../shared/helpers';
import { Action } from '@ngrx/store';
import { SearchFieldBlurAction } from '../search-field/search-field-actions';
import { actionNameIs } from '../../../shared/action-name-is.fn';

@Injectable()
export class SelectorInputBlurEffect {

  @Effect() effect = this.actions
    .ofType('SEARCH_FIELD_BLUR')
    .filter((action: SearchFieldBlurAction) => this.registeredSelects.includes(action.payload.name))
    .switchMap((action: SearchFieldBlurAction) => Observable
      .of<SelectorInputBlurAction>({
        type: 'SELECTOR_INPUT_BLUR',
        payload: { name: action.payload.name }
      })
      .delay(SELECTOR_BLUR_DELAY)
      .takeUntil(this.actions.ofType('SELECTOR_LIST_SELECT').filter(actionNameIs(action.payload.name)))
    );

  registerSelect(name: string) {
    this.registeredSelects.push(name);
  }

  unregisterSelect(name: string) {
    spliceOneValue(this.registeredSelects, name);
  }

  constructor(private actions: Actions) {
  }

  private registeredSelects: string[] = [];

}

export interface SelectorInputBlurAction extends Action {
  type: 'SELECTOR_INPUT_BLUR';
  payload: {
    name: string;
  }
}

const SELECTOR_BLUR_DELAY = 180; // obtained experimentally
