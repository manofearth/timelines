import { Injectable } from '@angular/core';
import { Client } from 'elasticsearch';
import { elasticSearchConfig } from '../../../environments/elastic-search.config';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ElasticSearchService {

  private client: Client;

  constructor() {
    this.client = new Client(elasticSearchConfig);
  }

  createIndex(name: string): Observable<any> {
    return Observable.fromPromise(this.client.indices.create({
      index: name,
    }) as Promise<any>);
  }
}
