import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AppState } from '../../../reducers';
import { Store } from '@ngrx/store';
import { SelectorState } from '../selector-input/selector-state';
import { Observable } from 'rxjs/Observable';
import { SelectorListItem } from '../selector-list/selector-list-item';
import { SearchFieldComponent } from '../search-field/search-field.component';

@Component({
  selector: 'tl-selector-select',
  templateUrl: './selector-select.component.html',
  styleUrls: ['./selector-select.component.css']
})
export class SelectorSelectComponent implements OnInit {

  @Input() name: string;
  @Input() placeholder: string;
  @Input() stateMapFn: (state: AppState) => SelectorState;

  @ViewChild('searchField') searchField: SearchFieldComponent;

  isSearching$: Observable<boolean>;
  searchQuery$: Observable<string>;
  results$: Observable<SelectorListItem<any>[]>;
  highlightedIndex$: Observable<number>;
  selectedItem$: Observable<SelectorListItem<any>>;

  isDropdownVisible: boolean;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {
    this.isSearching$ = this.store.select(state => this.stateMapFn(state).isSearching);
    this.searchQuery$ = this.store.select(state => this.stateMapFn(state).query);
    this.results$ = this.store.select(state => this.stateMapFn(state).results);
    this.highlightedIndex$ = this.store.select(state => this.stateMapFn(state).highlightedIndex);
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
    setTimeout(() => {
      this.searchField.focus();
    }, 0); // to render on next tick
    this.isDropdownVisible = true;
  }

}
