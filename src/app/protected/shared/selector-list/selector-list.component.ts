import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectorListItem } from './selector-list-item';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { Observable } from 'rxjs/Observable';
import { SelectorListSelectAction } from './selector-list-actions';

@Component({
  selector: 'tl-selector-list',
  templateUrl: './selector-list.component.html',
  styleUrls: ['./selector-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorListComponent implements OnInit {

  @Input() name: string;

  @Output() select = new EventEmitter<SelectorListItem>();

  results$: Observable<SelectorListItem[]>;
  currentIndex$: Observable<SelectorListItem>;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {
    this.results$ = this.store.select('selectors', this.name, 'results');
    this.currentIndex$ = this.store.select('selectors', this.name, 'highlightedIndex');
  }

  onItemSelect(item: SelectorListItem) {
    const action: SelectorListSelectAction = {
      type: 'SELECTOR_LIST_SELECT',
      payload: {
        name: this.name,
        item: item.item
      },
    };
    this.store.dispatch(action);
  }

}
