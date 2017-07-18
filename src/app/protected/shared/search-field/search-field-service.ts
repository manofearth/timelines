import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

export interface SearchFieldService {
  queryListener: Observer<string>;
  isSearching$: Observable<boolean>;
}
