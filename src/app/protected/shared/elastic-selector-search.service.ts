import { SelectorSearchService } from './selector/selector-search.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { SelectorSearchResultItem } from './selector/selector-search-result-item';
import { ElasticSearchService, SearchHit, SearchResponseData } from './elastic-search.service';

export abstract class ElasticSelectorSearchService<THitSource,
  THitHighlight,
  TResultItem extends SelectorSearchResultItem> extends SelectorSearchService {

  constructor(
    private elasticSearch: ElasticSearchService<THitSource, THitHighlight>,
  ) {
    super();
  }

  protected search(query: string): Observable<SelectorSearchResultItem[]> {

    if (!query) {
      return Observable.of([]);
    }

    return this.elasticSearch
      .search(query)
      .map(result => this.toSelectorSearchResultItems(result));
  }

  protected abstract mapToResultItem(hit: SearchHit<THitSource, THitHighlight>): TResultItem;

  private toSelectorSearchResultItems(
    searchData: SearchResponseData<THitSource, THitHighlight>): TResultItem[] {
    return searchData.hits.hits.map(item => this.mapToResultItem(item));
  }
}

