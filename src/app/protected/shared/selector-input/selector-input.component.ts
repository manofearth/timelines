import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../../../reducers';
import { Store } from '@ngrx/store';
import { SelectorListItem } from '../selector-list/selector-list-item';
import { SelectorInputState } from './selector-input-state';
import { SelectorInputInitAction } from './selector-input-actions';

@Component({
  selector: 'tl-selector-input',
  templateUrl: './selector-input.component.html',
  styleUrls: ['./selector-input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorInputComponent implements OnInit {

  @Input() name: string;
  @Input() placeholder: string;
  @Input() stateMapFn: (state: AppState) => SelectorInputState<any>;

  show$: Observable<boolean>;
  isSearching$: Observable<boolean>;
  searchQuery$: Observable<string>;
  results$: Observable<SelectorListItem<any>[]>;
  highlightedIndex$: Observable<number>;

  constructor(
    private store: Store<AppState>
  ) {
  }

  ngOnInit() {

    this.dispatchInitAction();

    this.show$ = this.store.select<boolean>(state => this.stateMapFn(state).results.length !== 0);
    this.isSearching$ = this.store.select<boolean>(state => this.stateMapFn(state).isSearching);
    this.searchQuery$ = this.store.select<string>(state => this.stateMapFn(state).query);
    this.results$ = this.store.select<SelectorListItem<any>[]>(state => this.stateMapFn(state).results);
    this.highlightedIndex$ = this.store.select<number>(state => this.stateMapFn(state).highlightedIndex);
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
