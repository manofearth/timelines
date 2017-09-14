import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SelectorListItem } from './selector-list-item';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { Observable } from 'rxjs/Observable';
import { SelectorListSelectAction } from './selector-list-actions';
import { SelectorListState } from './selector-list-state';

@Component({
  selector: 'tl-selector-list',
  templateUrl: './selector-list.component.html',
  styleUrls: ['./selector-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorListComponent {

  @Input() name: string;
  @Input() stateSelector: (state: AppState) => SelectorListState<any>;

  results$: Observable<SelectorListItem<any>[]>;
  highlightedIndex$: Observable<number>;

  constructor(private store: Store<AppState>) {
    this.results$ = this.store.select(state => this.stateSelector(state).results);
    this.highlightedIndex$ = this.store.select(state => this.stateSelector(state).highlightedIndex);
  }

  onItemSelect(item: SelectorListItem<any>) {
    const action: SelectorListSelectAction = {
      type: 'SELECTOR_LIST_SELECT',
      payload: {
        name: this.name,
        item: item
      },
    };
    this.store.dispatch(action);
  }

}
