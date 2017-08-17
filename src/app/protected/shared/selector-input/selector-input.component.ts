import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../../../reducers';
import { Action, Store } from '@ngrx/store';
import { SelectorListItem } from '../selector-list/selector-list-item';
import { SelectorInputState } from './selector-input-state';
import { SelectorInputInitAction } from './selector-input-actions';
import { Actions } from '@ngrx/effects';
import { SearchFieldEnterKeyAction } from '../search-field/search-field-actions';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'tl-selector-input',
  templateUrl: './selector-input.component.html',
  styleUrls: ['./selector-input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorInputComponent implements OnInit, OnDestroy {

  @Input() name: string;
  @Input() placeholder: string;
  @Input() stateSelector: (state: AppState) => SelectorInputState<any>;

  show$: Observable<boolean>;
  isSearching$: Observable<boolean>;
  searchQuery$: Observable<string>;
  results$: Observable<SelectorListItem<any>[]>;
  highlightedIndex$: Observable<number>;

  private createSub: Subscription;

  constructor(
    private store: Store<AppState>,
    private actions: Actions,
  ) {
  }

  ngOnInit() {

    this.dispatchInitAction();

    this.show$ = this.store.select<boolean>(state => this.stateSelector(state).results.length !== 0);
    this.isSearching$ = this.store.select<boolean>(state => this.stateSelector(state).isSearching);
    this.searchQuery$ = this.store.select<string>(state => this.stateSelector(state).query);
    this.results$ = this.store.select<SelectorListItem<any>[]>(state => this.stateSelector(state).results);
    this.highlightedIndex$ = this.store.select<number>(state => this.stateSelector(state).highlightedIndex);

    this.createSub = this.actions
      .ofType('SEARCH_FIELD_ENTER_KEY')
      .filter<SearchFieldEnterKeyAction>(action => action.payload.name === this.name)
      .withLatestFrom(this.results$, this.isSearching$)
      .filter(([action, results, isSearching]) => !isSearching && results.length === 0)
      .map(([action, results, isSearching]): SelectorInputCreateAction => ({
        type: 'SELECTOR_INPUT_CREATE',
        payload: {
          name: this.name,
          value: action.payload.value
        }
      }))
      .subscribe(this.store);
  }

  ngOnDestroy() {
    this.createSub.unsubscribe();
  }

  private dispatchInitAction() {
    const action: SelectorInputInitAction = {
      type: 'SELECTOR_INPUT_INIT',
      payload: {
        name: this.name,
      }
    };
    this.store.dispatch(action);
  }
}

export interface SelectorInputCreateAction extends Action {
  type: 'SELECTOR_INPUT_CREATE';
  payload: {
    name: string;
    value: string;
  }
}
