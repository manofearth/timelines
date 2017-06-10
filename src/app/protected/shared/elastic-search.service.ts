import { Injectable } from '@angular/core';
import { Client } from 'elasticsearch';
import { elasticSearchConfig } from '../../../environments/elastic-search.config';

@Injectable()
export class ElasticSearchService {

  private client: Client;

  constructor() {
    this.client = new Client(elasticSearchConfig);
  }
}
