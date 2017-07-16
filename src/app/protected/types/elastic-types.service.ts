import { Injectable } from '@angular/core';
import { ElasticSearchService, SearchHit } from '../shared/elastic-search.service';
import { SelectorSearchResultItem } from '../shared/selector/selector-search-result-item';
import { Http } from '@angular/http';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class ElasticTypesService extends ElasticSearchService<TypeHitSource, TypeHitHighlight, TypeSearchItem> {

  constructor(
    http: Http,
    fireAuth: AngularFireAuth,
  ) {
    super(http, fireAuth);
  }

  protected getSearchUrl(): string {
    return '/functions/searchEventsTypes';
  }

  protected mapToResultItem(hit: SearchHit<TypeHitSource, TypeHitHighlight>): TypeSearchItem {
    return {
      title: hit.highlight.title[0],
      item: {
        id: hit._id,
      },
    };
  }
}

interface TypeHitSource {
  title: string;
  ownerId: string;
}

interface TypeHitHighlight {
  title: string[];
}

interface TypeSearchItem extends SelectorSearchResultItem {
  title: string;
  item: {
    id: string;
  }
}
