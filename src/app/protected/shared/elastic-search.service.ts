import { Http, Response } from '@angular/http';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export abstract class ElasticSearchService<THitSource, THitHighlight> {

  constructor(
    private http: Http,
    private fireAuth: AngularFireAuth,
  ) {
  }

  search(query: string): Observable<SearchResponseData<THitSource, THitHighlight>> {

    return this.http
      .get(this.getSearchUrl(), {
        params: prepareParams(this.fireAuth.auth.currentUser.uid, query)
      })
      .map((res: Response) => res.json() as SearchResponseData<THitSource, THitHighlight>);
  }

  protected abstract getSearchUrl(): string;

}

export interface SearchResponseData<THitSource, THitHighlight> {
  hits: {
    hits: SearchHit<THitSource, THitHighlight>[];
  };
}

export interface SearchHit<THitSource, THitHighlight> {
  _id: string;
  _source: THitSource
  highlight: THitHighlight;
}

function prepareParams(ownerId: string, query: string): RequestParams {

  const params: RequestParams = {
    o: ownerId,
  };
  if (query) {
    params.q = query;
  }

  return params;
}

interface RequestParams {
  o: string;
  q?: string;
}
