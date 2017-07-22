import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { SelectorSearchResultItem } from './selector-search-result-item';
import { SearchFieldService } from '../search-field/search-field-service';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/observable/merge';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SelectorListService } from '../selector-list/selector-list-service';

export abstract class SelectorSearchService implements SearchFieldService, SelectorListService {

  upDownListener: Subject<'up' | 'down'>;
  queryListener: Subject<string>;

  results$: Observable<SelectorSearchResultItem[]>;
  isSearching$: Observable<boolean>;
  currentIndex$: BehaviorSubject<number>;

  constructor() {

    this.queryListener = new Subject<string>();
    this.upDownListener = new Subject<'up' | 'down'>();
    this.currentIndex$ = new BehaviorSubject<number>(0);

    this.results$ = this.queryListener
      .switchMap(this.search.bind(this));

    this.isSearching$ = Observable
      .merge(
        this.queryListener.asObservable().map(() => true),
        this.results$.map(() => false)
      )
      .startWith(false);

    Observable
      .merge(
        this.results$.map(() => 0),
        this.upDownListener
          .withLatestFrom(this.currentIndex$, this.results$)
          .map(([action, currentIndex, results]) => {
            let nextIndex = currentIndex + (action === 'up' ? 1 : -1);
            if (nextIndex < 0) {
              nextIndex = results.length - 1;
            } else if (nextIndex >= results.length) {
              nextIndex = 0;
            }
            return nextIndex;
          })
      )
      .subscribe(this.currentIndex$);
  }

  toInitialSearchState() {
    this.queryListener.next('');
  }

  protected abstract search(query: string): Observable<SelectorSearchResultItem[]>;
}
