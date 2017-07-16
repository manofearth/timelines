import { SelectorSearchService } from './selector/selector-search.service';
import { Http, Response } from '@angular/http';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { SelectorSearchResultItem } from './selector/selector-search-result-item';

export abstract class ElasticSearchService<THitSource,
  THitHighlight,
  TResultItem extends SelectorSearchResultItem> extends SelectorSearchService {

  constructor(
    private http: Http,
    private fireAuth: AngularFireAuth,
  ) {
    super();
  }

  search(query: string): Observable<SelectorSearchResultItem[]> {

    if (!query) {
      return Observable.of([]);
    }

    return this.http
      .get(this.getSearchUrl(), {
        params: {
          q: query,
          o: this.fireAuth.auth.currentUser.uid,
        }
      })
      .map((res: Response) => this.toSelectorSearchResultItems(res.json()));
  }

  protected abstract getSearchUrl(): string;

  protected abstract mapToResultItem(hit: SearchHit<THitSource, THitHighlight>): TResultItem;

  private toSelectorSearchResultItems(
    searchData: SearchResponseData<THitSource, THitHighlight>): TResultItem[] {
    return searchData.hits.hits.map(item => this.mapToResultItem(item));
  }
}

interface SearchResponseData<THitSource, THitHighlight> {
  hits: {
    hits: SearchHit<THitSource, THitHighlight>[];
  };
}

export interface SearchHit<THitSource, THitHighlight> {
  _id: string;
  _source: THitSource
  highlight: THitHighlight;
}
