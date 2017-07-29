import { Component, Input, OnInit } from '@angular/core';
import { AppState } from '../../../reducers';
import { Store } from '@ngrx/store';
import { SelectorState } from '../selector-input/selector-state';
import { Observable } from 'rxjs/Observable';
import { SelectorListItem } from '../selector-list/selector-list-item';

@Component({
  selector: 'tl-selector-select',
  templateUrl: './selector-select.component.html',
  styleUrls: ['./selector-select.component.css']
})
export class SelectorSelectComponent implements OnInit {

  @Input() name: string;
  @Input() stateMapFn: (state: AppState) => SelectorState;

  isSearching$: Observable<boolean>;
  searchQuery$: Observable<string>;
  results$: Observable<SelectorListItem[]>;
  highlightedIndex$: Observable<number>;
  isDropdownVisible: boolean;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.isSearching$ = this.store.select(state => this.stateMapFn(state).isSearching);
    this.searchQuery$ = this.store.select(state => this.stateMapFn(state).query);
    this.results$ = this.store.select(state => this.stateMapFn(state).results);
    this.highlightedIndex$ = this.store.select(state => this.stateMapFn(state).highlightedIndex);
  }

  showDropdown() {
    this.isDropdownVisible = true;
  }

}
