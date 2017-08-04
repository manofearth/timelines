import { Component, Input, OnInit } from '@angular/core';
import { AppState } from '../../../reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { SelectorListItem } from '../selector-list/selector-list-item';
import { SelectorSelectState } from './selector-select-state';
import { SelectorSelectButtonAction, SelectorSelectInitAction } from './selector-select-actions';

@Component({
  selector: 'tl-selector-select',
  templateUrl: './selector-select.component.html',
  styleUrls: ['./selector-select.component.css']
})
export class SelectorSelectComponent implements OnInit {

  @Input() name: string;
  @Input() placeholder: string;
  @Input() stateMapFn: (state: AppState) => SelectorSelectState<any>;

  isSearching$: Observable<boolean>;
  searchQuery$: Observable<string>;
  results$: Observable<SelectorListItem<any>[]>;
  highlightedIndex$: Observable<number>;
  selectedItem$: Observable<SelectorListItem<any>>;
  isDropdownVisible$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {

    this.dispatchInitAction();

    this.isSearching$ = this.store.select(state => this.stateMapFn(state).isSearching);
    this.searchQuery$ = this.store.select(state => this.stateMapFn(state).query);
    this.results$ = this.store.select(state => this.stateMapFn(state).results);
    this.highlightedIndex$ = this.store.select(state => this.stateMapFn(state).highlightedIndex);
    this.isDropdownVisible$ = this.store.select(state => this.stateMapFn(state).isDropdownVisible);
    this.selectedItem$ = this.store.select(state => this.stateMapFn(state).selectedItem).map(val => {
      if (val) {
        return val;
      } else {
        return {
          title: this.placeholder,
          item: {
            title: this.placeholder,
          }
        }
      }
    });
  }

  onMainButtonClick() {
    const action: SelectorSelectButtonAction = {
      type: 'SELECTOR_SELECT_BUTTON',
      payload: {
        name: this.name,
      }
    };
    this.store.dispatch(action);
  }

  private dispatchInitAction() {
    const action: SelectorSelectInitAction = {
      type: 'SELECTOR_SELECT_INIT',
      payload: {
        name: this.name,
      }
    };
    this.store.dispatch(action);
  }
}
