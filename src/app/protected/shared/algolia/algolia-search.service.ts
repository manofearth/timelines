import { Injectable } from '@angular/core';
import { algoliaConfig } from '../../../../environments/algolia.config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import * as algolia from 'algoliasearch';
import { TimelineDate } from '../date/date';

@Injectable()
export class AlgoliaSearchService {

  private client: algolia.AlgoliaClient;
  private eventsIndex: algolia.AlgoliaIndex;

  constructor() {
    this.client = algolia(algoliaConfig.applicationId, algoliaConfig.apiKeySearchOnly);
    this.eventsIndex = this.client.initIndex('events');
  }

  searchEvents(query: string): Observable<AlgoliaSearchResult<AlgoliaEvent>> {
    return Observable.fromPromise(
      this.eventsIndex.search({
        query: query,
        hitsPerPage: 20,
        page: 0,
      })
    );
  }
}

export interface AlgoliaSearchResult<T> {
  hits: T[];
}

export interface AlgoliaEvent {
  dateBegin: TimelineDate;
  dateEnd: TimelineDate;
  title: string;
  typeId: string;
  objectId: string;
  _highlightResult: {
    dateBegin: {
      title: AlgoliaHighlightedFieldValue;
    }
    dateEnd: {
      title: AlgoliaHighlightedFieldValue;
    }
    title: AlgoliaHighlightedFieldValue;
    typeId: AlgoliaHighlightedFieldValue;
  }
}

export interface AlgoliaHighlightedFieldValue {
  value: string;
  matchLevel: 'none' | 'full';
  fullyHighlighted?: boolean;
  matchedWords: string[];
}
