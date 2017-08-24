import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../../../reducers';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { SelectorListItem } from '../selector-list/selector-list-item';
import { SelectorSelectState } from './selector-select-state';
import { SelectorSelectButtonAction, SelectorSelectInitAction } from './selector-select-actions';
import { Subscription } from 'rxjs/Subscription';
import { SelectorInputBlurEffect } from '../selector-input/selector-input-blur.effect';

@Component({
  selector: 'tl-selector-select',
  templateUrl: './selector-select.component.html',
  styleUrls: ['./selector-select.component.css']
})
export class SelectorSelectComponent implements OnInit, OnDestroy {

  @Input() name: string;
  @Input() placeholder: string;
  @Input() stateSelector: (state: AppState) => SelectorSelectState<any>;
  @Input() hasDanger: boolean = false;

  isSearching$: Observable<boolean>;
  searchQuery$: Observable<string>;
  results$: Observable<SelectorListItem<any>[]>;
  highlightedIndex$: Observable<number>;
  selectedItem$: Observable<SelectorListItem<any>>;
  isDropdownVisible$: Observable<boolean>;

  private selectedItemSub: Subscription;

  constructor(
    private store: Store<AppState>,
    private blurEffect: SelectorInputBlurEffect) {
  }

  ngOnInit() {

    this.dispatchInitAction();

    this.isSearching$ = this.store.select(state => this.stateSelector(state).isSearching);
    this.searchQuery$ = this.store.select(state => this.stateSelector(state).query);
    this.results$ = this.store.select(state => this.stateSelector(state).results);
    this.highlightedIndex$ = this.store.select(state => this.stateSelector(state).highlightedIndex);
    this.isDropdownVisible$ = this.store.select(state => this.stateSelector(state).isDropdownVisible);
    this.selectedItem$ = this.store.select(state => this.stateSelector(state).selectedItem).map(val => {
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

    this.blurEffect.registerSelect(this.name);

    this.selectedItemSub = this.store
      .select<SelectorListItem<any>>(state => this.stateSelector(state).selectedItem)
      .filter(item => item !== null)
      .map((selectedItem): SelectorSelectSelectedAction => ({
        type: 'SELECTOR_SELECT_SELECTED',
        payload: {
          name: this.name,
          value: selectedItem.item,
        },
      }))
      .subscribe(this.store);
  }

  ngOnDestroy() {
    this.blurEffect.unregisterSelect(this.name);
    this.selectedItemSub.unsubscribe();
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

export interface SelectorSelectSelectedAction extends Action {
  type: 'SELECTOR_SELECT_SELECTED';
  payload: {
    name: string;
    value: any;
  }
}

