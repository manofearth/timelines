import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { SelectorSearchResultItem } from './selector-search-result-item';

export abstract class SelectorSearchService {

  private _queryListener: Subject<string>;
  private _results$: Observable<SelectorSearchResultItem[]>;

  constructor() {
    this._queryListener = new Subject<string>();
    this._results$ = this._queryListener
      .asObservable()
      .switchMap(this.search.bind(this));
  }

  get queryListener(): Subject<string> {
    return this._queryListener;
  }

  get results$(): Observable<SelectorSearchResultItem[]> {
    return this._results$;
  }

  abstract search(query: string): Observable<SelectorSearchResultItem[]>;
}
