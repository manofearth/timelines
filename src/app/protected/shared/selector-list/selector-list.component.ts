import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
export class SelectorListComponent {

  @Input() name: string;
  @Input() results$: Observable<SelectorListItem<any>[]> = Observable.of([]);
  @Input() highlightedIndex$: Observable<number> = Observable.of(0);

  constructor(private store: Store<AppState>) {
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
