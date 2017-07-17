import { Injectable } from '@angular/core';
import { ElasticSearchService, SearchHit, SearchResponseData } from '../shared/elastic-search.service';
import { Http } from '@angular/http';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class TypesElasticSearchService extends ElasticSearchService<TypeHitSource, TypeHitHighlight> {

  constructor(http: Http, fireAuth: AngularFireAuth) {
    super(http, fireAuth);
  }

  protected getSearchUrl(): string {
    return '/functions/searchEventsTypes';
  }

}

export type TypesElasticSearchResponse = SearchResponseData<TypeHitSource, TypeHitHighlight>;
export type TypesElasticSearchHit = SearchHit<TypeHitSource, TypeHitHighlight>;

export interface TypeHitSource {
  title: string;
  ownerId: string;
}

export interface TypeHitHighlight {
  title: string[];
}
