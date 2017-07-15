import { Injectable } from '@angular/core';
import { SelectorSearchService } from '../shared/selector/selector-search.service';
import { Observable } from 'rxjs/Observable';
import { SelectorSearchResultItem } from '../shared/selector/selector-search-result-item';

@Injectable()
export class TypesSearchService extends SelectorSearchService {

  protected search(query: string): Observable<SelectorSearchResultItem[]> {
    return Observable.of([]);
  }

}
