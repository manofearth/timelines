import { Injectable } from '@angular/core';
import { algoliaConfig } from '../../../../environments/algolia.config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import * as algolia from 'algoliasearch';
import { TimelineDate } from '../date/date';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AlgoliaSearchService {

  private client: algolia.AlgoliaClient;
  private eventsIndex: algolia.AlgoliaIndex;

  constructor(
    private auth: AngularFireAuth,
  ) {
    this.client = algolia(algoliaConfig.applicationId, algoliaConfig.apiKeySearchOnly);
    this.eventsIndex = this.client.initIndex('events');
  }

  searchEvents(query: string): Observable<AlgoliaSearchResult<AlgoliaEvent>> {
    return Observable.fromPromise(
      this.eventsIndex.search({
        query: query,
        filters: `ownerId:${this.auth.auth.currentUser.uid}`,
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
    title: AlgoliaHighlightedFieldValue;
  }
}

export interface AlgoliaHighlightedFieldValue {
  value: string;
  matchLevel: 'none' | 'full';
  fullyHighlighted?: boolean;
  matchedWords: string[];
}
