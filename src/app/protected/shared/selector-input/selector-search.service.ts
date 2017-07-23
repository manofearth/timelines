import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { SelectorSearchResultItem } from './selector-search-result-item';
import { SearchFieldService, SearchFieldAction } from '../search-field/search-field-service';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/observable/merge';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SelectorListService } from '../selector-list/selector-list-service';
import { Subscription } from 'rxjs/Subscription';

export abstract class SelectorSearchService implements SearchFieldService, SelectorListService {

  searchFieldActionsListener: Subject<SearchFieldAction>;
  queryListener: Subject<string>;

  results$: Observable<SelectorSearchResultItem[]>;
  currentItem$: Observable<SelectorSearchResultItem>;
  isSearching$: Observable<boolean>;

  private currentIndex$: BehaviorSubject<number>;
  private currentIndexSub: Subscription;

  constructor() {

    this.queryListener = new Subject<string>();
    this.searchFieldActionsListener = new Subject<SearchFieldAction>();
    this.currentIndex$ = new BehaviorSubject<number>(0);

    this.results$ = this.queryListener
      .switchMap(this.search.bind(this));

    this.isSearching$ = Observable
      .merge(
        this.queryListener.asObservable().map(() => true),
        this.results$.map(() => false)
      )
      .startWith(false);

    this.currentIndexSub = Observable
      .merge(
        this.results$.map(() => 0),
        this.searchFieldActionsListener
          .filter(val => val === 'up')
          .withLatestFrom(this.currentIndex$, (ignore, currentIndex) => currentIndex - 1)
          .withLatestFrom(this.results$, (nextIndex, results) => nextIndex < 0 ? results.length - 1 : nextIndex),
        this.searchFieldActionsListener
          .filter(val => val === 'down')
          .withLatestFrom(this.currentIndex$, (ignore, currentIndex) => currentIndex + 1)
          .withLatestFrom(this.results$, (nextIndex, results) => nextIndex >= results.length ? 0 : nextIndex),
      )
      .subscribe(this.currentIndex$);

    this.currentItem$ = this.currentIndex$
      .withLatestFrom(this.results$, (currentIndex, results) => results[currentIndex])
  }

  toInitialSearchState() {
    this.queryListener.next('');
  }

  dispose() {
    this.currentIndexSub.unsubscribe();
  }

  protected abstract search(query: string): Observable<SelectorSearchResultItem[]>;
}
