import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Http } from '@angular/http';
import { ElasticSearchService } from '../shared/elastic-search.service';

@Injectable()
export class TimelineEventsElasticSearchService extends ElasticSearchService<EventHitSource, EventHitHighlight> {

  constructor(
    http: Http,
    fireAuth: AngularFireAuth,
  ) {
    super(http, fireAuth);
  }

  protected getSearchUrl(): string {
    return '/functions/searchTimelineEvents';
  }
}

export interface EventHitSource {
  title: string;
  ownerId: string;
}

export interface EventHitHighlight {
  title: string[];
}
