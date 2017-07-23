import { SelectorListItem } from './selector-list-item';
import { Observable } from 'rxjs/Observable';

export interface SelectorListService {
  results$: Observable<SelectorListItem[]>;
  currentItem$: Observable<SelectorListItem>;
}
