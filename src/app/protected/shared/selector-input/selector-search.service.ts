import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { SelectorSearchResultItem } from './selector-search-result-item';
import { SearchFieldService } from '../search-field/search-field-service';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/combineLatest';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export abstract class SelectorSearchService implements SearchFieldService {

  upDownListener: Subject<'up' | 'down'>;
  queryListener: Subject<string>;
  results$: Observable<SelectorSearchResultItem[]>;
  isSearching$: BehaviorSubject<boolean>;

  constructor() {
    this.queryListener = new Subject<string>();
    this.upDownListener = new Subject<'up' | 'down'>();
    this.isSearching$ = new BehaviorSubject<boolean>(false);
    this.results$ = this.queryListener
      .asObservable()
      .do(() => {
        this.isSearching$.next(true);
      })
      .switchMap(this.search.bind(this))
      .do(() => {
        this.isSearching$.next(false);
      });
  }

  toInitialSearchState() {
    this.queryListener.next('');
  }

  protected abstract search(query: string): Observable<SelectorSearchResultItem[]>;
}
