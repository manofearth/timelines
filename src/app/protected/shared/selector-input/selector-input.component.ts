import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../../../reducers';
import { Action, Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { SelectorListSelectAction } from '../selector-list/selector-list-actions';
import { Subscription } from 'rxjs/Subscription';
import { SearchFieldEnterKeyAction } from '../search-field/search-field-actions';
import { SelectorState } from './selector-state';

@Component({
  selector: 'tl-selector',
  templateUrl: './selector-input.component.html',
  styleUrls: ['./selector-input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorInputComponent implements OnInit, OnDestroy {

  @Input() name: string;
  @Input() placeholder: string;

  show$: Observable<boolean>;

  private selectSub: Subscription;
  private enterSub: Subscription;

  constructor(
    private store: Store<AppState>,
    private actions: Actions,
  ) {
  }

  ngOnInit() {

    this.store.dispatch({
      type: 'SELECTOR_INIT',
      payload: {
        name: this.name,
      }
    });

    this.show$ = this.store.select('selectors', this.name, 'results').map(results => results !== 0);

    this.mapListSelectAction();
    this.mapSearchFieldInputAction();
  }

  ngOnDestroy() {
    this.selectSub.unsubscribe();
    this.enterSub.unsubscribe();
  }

  private mapListSelectAction() {
    this.selectSub = this.actions
      .ofType('SELECTOR_LIST_SELECT')
      .filter<SelectorListSelectAction>(action => action.payload.name === this.name)
      .map<SelectorListSelectAction, SelectorInputSelectAction>(action => ({
        type: 'SELECTOR_INPUT_SELECT',
        payload: {
          name: this.name,
          item: action.payload.item,
        }
      }))
      .subscribe(this.store);
  }

  private mapSearchFieldInputAction() {
    this.enterSub = this.actions
      .ofType('SEARCH_FIELD_ENTER_KEY')
      .filter<SearchFieldEnterKeyAction>(action => action.payload.name === this.name)
      .withLatestFrom(this.store.select<SelectorState>('selectors', this.name))
      .map(([action, selectorState]) => ({
        type: 'SELECTOR_INPUT_SELECT',
        payload: {
          name: this.name,
          item: selectorState.results[selectorState.highlightedIndex].item,
        }
      }))
      .subscribe(this.store);
  }
}

export interface SelectorInputSelectAction extends Action {
  type: 'SELECTOR_INPUT_SELECT';
  payload: {
    name: string;
    item: any;
  }
}
