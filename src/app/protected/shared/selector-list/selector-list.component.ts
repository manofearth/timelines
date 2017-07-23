import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectorListItem } from './selector-list-item';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { Observable } from 'rxjs/Observable';

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
    this.select.next(item);
  }

}
