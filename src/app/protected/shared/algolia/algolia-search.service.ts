import { Injectable } from '@angular/core';
import { algoliaConfig } from '../../../../environments/algolia.config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import * as algolia from 'algoliasearch';
import { TimelineDate } from '../date/date';
import { AngularFireAuth } from 'angularfire2/auth';
import { TypeKind } from '../../type/type-states';

@Injectable()
export class AlgoliaSearchService {

  private client: algolia.AlgoliaClient;
  private _eventsIndex: algolia.AlgoliaIndex;
  private _typesIndex: algolia.AlgoliaIndex;
  private _infoSourcesIndex: algolia.AlgoliaIndex;

  constructor(
    private auth: AngularFireAuth,
  ) {
    this.client = algolia(algoliaConfig.applicationId, algoliaConfig.apiKeySearchOnly);
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

  searchTypes(query: string): Observable<AlgoliaSearchResult<AlgoliaType>> {
    return Observable.fromPromise(
      this.typesIndex.search({
        query: query,
        filters: `ownerId:${this.auth.auth.currentUser.uid}`,
        hitsPerPage: 20,
        page: 0,
      })
    );
  }

  searchInfoSources(query: string): Observable<AlgoliaSearchResult<AlgoliaInfoSource>> {
    return Observable.fromPromise(
      this.infoSourcesIndex.search({
        query: query,
        filters: `ownerId:${this.auth.auth.currentUser.uid}`,
        hitsPerPage: 20,
        page: 0,
      })
    );
  }

  clearCacheEvents() {
    this.eventsIndex.clearCache();
  }

  clearCacheTypes() {
    this.typesIndex.clearCache();
  }

  clearCacheInfoSources() {
    this.infoSourcesIndex.clearCache();
  }

  private get eventsIndex(): algolia.AlgoliaIndex {
    if (!this._eventsIndex) {
      this._eventsIndex = this.client.initIndex('events');
    }
    return this._eventsIndex;
  }

  private get typesIndex(): algolia.AlgoliaIndex {
    if (!this._typesIndex) {
      this._typesIndex = this.client.initIndex('types');
    }
    return this._typesIndex;
  }

  private get infoSourcesIndex(): algolia.AlgoliaIndex {
    if (!this._infoSourcesIndex) {
      this._infoSourcesIndex = this.client.initIndex('info-sources');
    }
    return this._infoSourcesIndex;
  }
}

export interface AlgoliaSearchResult<T> {
  hits: T[];
}

export interface AlgoliaObject {
  objectID: string;
}

export interface AlgoliaEvent extends AlgoliaObject {
  dateBegin: TimelineDate;
  dateEnd: TimelineDate;
  title: string;
  typeId: string;
  _highlightResult: {
    title: AlgoliaHighlightedFieldValue;
  }
}

export interface AlgoliaType extends AlgoliaObject {
  ownerId: string;
  kind: TypeKind;
  title: string;
  _highlightResult: {
    title: AlgoliaHighlightedFieldValue;
  }
}

export interface AlgoliaInfoSource extends AlgoliaObject {
  ownerId: string;
  title: string;
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
