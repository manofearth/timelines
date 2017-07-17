import { SelectorSearchResultItem } from '../shared/selector/selector-search-result-item';
import { Injectable } from '@angular/core';
import { ElasticSelectorSearchService } from '../shared/elastic-selector-search.service';
import {
  EventHitHighlight,
  EventHitSource,
  TimelineEventsElasticSearchService
} from './timeline-events-elastic-search.service';
import { SearchHit } from '../shared/elastic-search.service';

@Injectable()
export class TimelineEventsSelectorSearchService
  extends ElasticSelectorSearchService<EventHitSource, EventHitHighlight, TimelineEventSearchItem> {

  constructor(
    private eventsElasticSearch: TimelineEventsElasticSearchService,
  ) {
    super(eventsElasticSearch);
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

interface TimelineEventSearchItem extends SelectorSearchResultItem {
  title: string;
  item: {
    id: string;
  }
}
