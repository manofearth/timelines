import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { SelectorSearchResultItem } from './selector-search-result-item';
import { SearchFieldService } from '../search-field/search-field-service';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observer } from 'rxjs/Observer';

export abstract class SelectorSearchService implements SearchFieldService {

  private _queryListener: Subject<string>;
  private _results$: Observable<SelectorSearchResultItem[]>;
  private _isSearchingListener: BehaviorSubject<boolean>;

  constructor() {
    this._queryListener = new Subject<string>();
    this._isSearchingListener = new BehaviorSubject<boolean>(false);
    this._results$ = this._queryListener
      .asObservable()
      .do(() => {
        this._isSearchingListener.next(true);
      })
      .switchMap(this.search.bind(this))
      .do(() => {
        this._isSearchingListener.next(false);
      });
  }

  get queryListener(): Observer<string> {
    return this._queryListener;
  }

  get results$(): Observable<SelectorSearchResultItem[]> {
    return this._results$;
  }

  get isSearching$(): Observable<boolean> {
    return this._isSearchingListener.asObservable();
  }

  protected abstract search(query: string): Observable<SelectorSearchResultItem[]>;
}
