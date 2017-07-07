import { SelectorSearchService } from '../shared/selector/selector-search.service';
import { Observable } from 'rxjs/Observable';
import { SelectorSearchResultItem } from '../shared/selector/selector-search-result-item';
import { Http, Response } from '@angular/http';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';

@Injectable()
export class TimelineEventsSearchService extends SelectorSearchService {

  constructor(
    private http: Http,
    private fireAuth: AngularFireAuth,
  ) {
    super();
  }

  protected search(query: string): Observable<SelectorSearchResultItem[]> {
    return this.http
      .get(TIMELINE_EVENTS_SEARCH_URL, {
        params: {
          q: query,
          o: this.fireAuth.auth.currentUser.uid,
        }
      })
      .map((res: Response) => toSelectorSearchResultItems(res.json()));
  }

}

const TIMELINE_EVENTS_SEARCH_URL = '/functions/queryElasticSearch';

interface SearchResponseData {
  hits: {
    hits: EventSearchHit[];
  };
}

interface EventSearchHit {
  _id: string;
  _source: EventHitSource
  highlight: EventHitHighlight;
}

interface EventHitSource {
  title: string;
  ownerId: string;
}

interface EventHitHighlight {
  title: string[];
}

interface TimelineEventSearchItem extends SelectorSearchResultItem {
  title: string;
  item: {
    title: string;
  }
}

function toSelectorSearchResultItems(searchData: SearchResponseData): TimelineEventSearchItem[] {
  return searchData.hits.hits.map(toSelectorSearchResultItem);
}

function toSelectorSearchResultItem(hit: EventSearchHit): TimelineEventSearchItem {
  return {
    title: hit.highlight.title[0],
    item: {
      title: hit._source.title,
    },
  };
}

