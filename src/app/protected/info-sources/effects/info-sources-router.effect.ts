import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { actionNameIs } from '../../../shared/action-name-is.fn';
import { SearchFieldCreateAction } from '../../shared/search-field/search-field-actions';
import 'rxjs/add/observable/fromPromise';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { INFO_SOURCES_LIST_SEARCH_FIELD_NAME } from '../info-sources-list.component';

@Injectable()
export class InfoSourcesRouterEffect {

  @Effect() navToNewInfoSource = this.actions
    .ofType('SEARCH_FIELD_CREATE')
    .filter<SearchFieldCreateAction>(actionNameIs(INFO_SOURCES_LIST_SEARCH_FIELD_NAME))
    .switchMap((action): Observable<NavigateToNewInfoSourceSuccessAction | NavigateToNewInfoSourceErrorAction> => Observable
      .fromPromise(this.router.navigate([ 'info-sources', 'new' ]))
      .map(success => ({
        type: success ? 'NAVIGATE_TO_NEW_INFO_SOURCE_SUCCESS' : 'NAVIGATE_TO_NEW_INFO_SOURCE_ERROR'
      }))
    );

  @Effect() nevToInfoSourcesList = this.actions
    .ofType('INFO_SOURCE_MODAL_CLOSED')
    .switchMap((action): Observable<NavigateToInfoSourcesListSuccessAction | NavigateToInfoSourcesListErrorAction> => Observable
      .fromPromise(this.router.navigate([ 'info-sources' ]))
      .map(success => ({
        type: success ? 'NAVIGATE_TO_INFO_SOURCES_LIST_SUCCESS' : 'NAVIGATE_TO_INFO_SOURCES_LIST_ERROR'
      }))
    );

  @Effect() routerInfoSources = this.router.events
    .map(extractInfoSourceId)
    .filter(infoSourceId => infoSourceId !== null)
    .map((infoSourceId): NavigatedToInfoSourcesListAction | NavigatedToNewInfoSourceAction | NavigatedToInfoSourceAction => {
      if (infoSourceId === '') {
        return {
          type: 'NAVIGATED_TO_INFO_SOURCES_LIST'
        }
      } else if (infoSourceId === 'new') {
        return {
          type: 'NAVIGATED_TO_NEW_INFO_SOURCE'
        }
      } else {
        return {
          type: 'NAVIGATED_TO_INFO_SOURCE',
          payload: { infoSourceId }
        }
      }
    });

  constructor(
    private actions: Actions,
    private router: Router,
  ) {
  }
}

function extractInfoSourceId(routerInfoSource: any): string | null {
  if (!(routerInfoSource instanceof NavigationEnd)) {
    return null;
  }

  const urlParts = routerInfoSource.urlAfterRedirects.split('/');

  if (urlParts.length < 2 || urlParts[ 1 ] !== 'info-sources') {
    return null;
  }

  return urlParts[ 2 ] === undefined ? '' : urlParts[ 2 ];
}

export interface NavigatedToInfoSourcesListAction extends Action {
  type: 'NAVIGATED_TO_INFO_SOURCES_LIST';
}

export interface NavigatedToNewInfoSourceAction extends Action {
  type: 'NAVIGATED_TO_NEW_INFO_SOURCE';
}

export interface NavigatedToInfoSourceAction extends Action {
  type: 'NAVIGATED_TO_INFO_SOURCE';
  payload: {
    infoSourceId: string;
  }
}

export interface NavigateToNewInfoSourceSuccessAction extends Action {
  type: 'NAVIGATE_TO_NEW_INFO_SOURCE_SUCCESS';
}

export interface NavigateToNewInfoSourceErrorAction extends Action {
  type: 'NAVIGATE_TO_NEW_INFO_SOURCE_ERROR';
}

export interface NavigateToInfoSourcesListSuccessAction extends Action {
  type: 'NAVIGATE_TO_INFO_SOURCES_LIST_SUCCESS';
}

export interface NavigateToInfoSourcesListErrorAction extends Action {
  type: 'NAVIGATE_TO_INFO_SOURCES_LIST_ERROR';
}
