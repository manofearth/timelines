import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../../../reducers';
import { Store } from '@ngrx/store';
import { SelectorListItem } from '../selector-list/selector-list-item';
import { SelectorInputState } from './selector-input-state';
import { SelectorInputInitAction } from './selector-input-actions';

@Component({
  selector: 'tl-selector-input',
  templateUrl: './selector-input.component.html',
  styleUrls: [ './selector-input.component.css' ],
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
  createByEnterKey$: Observable<boolean>;

  constructor(
    private store: Store<AppState>
  ) {
  }

  ngOnInit() {

    this.dispatchInitAction();

    this.show$ = this.store.select<boolean>(state => this.stateSelector(state).results.length !== 0);
    this.isSearching$ = this.store.select<boolean>(state => this.stateSelector(state).isSearching);
    this.searchQuery$ = this.store.select<string>(state => this.stateSelector(state).query);
    this.results$ = this.store.select<SelectorListItem<any>[]>(state => this.stateSelector(state).results);
    this.highlightedIndex$ = this.store.select<number>(state => this.stateSelector(state).highlightedIndex);
    this.createByEnterKey$ = this.store.select<boolean>(state => {
      const selectorState = this.stateSelector(state);
      return !selectorState.isSearching && selectorState.results.length === 0
    });
  }

  ngOnDestroy() {
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
