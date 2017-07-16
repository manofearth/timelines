import { SelectorSearchResultItem } from '../shared/selector/selector-search-result-item';
import { Injectable } from '@angular/core';
import { ElasticSearchService, SearchHit } from '../shared/elastic-search.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Http } from '@angular/http';

@Injectable()
export class TimelineEventsSearchService
  extends ElasticSearchService<EventHitSource, EventHitHighlight, TimelineEventSearchItem> {

  constructor(
    http: Http,
    fireAuth: AngularFireAuth,
  ) {
    super(http, fireAuth);
  }

  protected getSearchUrl(): string {
    return '/functions/searchTimelineEvents';
  }

  protected mapToResultItem(hit: SearchHit<EventHitSource, EventHitHighlight>): TimelineEventSearchItem {
    return {
      title: hit.highlight.title[0],
      item: {
        id: hit._id,
      },
    };
  }
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
    id: string;
  }
}
