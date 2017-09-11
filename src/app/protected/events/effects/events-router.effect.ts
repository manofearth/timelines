import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { EVENTS_LIST_SEARCH_FIELD_NAME } from '../events-list.component';
import { actionNameIs } from '../../../shared/action-name-is.fn';
import { SearchFieldCreateAction } from '../../shared/search-field/search-field-actions';
import 'rxjs/add/observable/fromPromise';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

@Injectable()
export class EventsRouterEffect {

  @Effect() navToNewEvent = this.actions
    .ofType('SEARCH_FIELD_CREATE')
    .filter<SearchFieldCreateAction>(actionNameIs(EVENTS_LIST_SEARCH_FIELD_NAME))
    .switchMap((action): Observable<NavigateToNewEventSuccessAction | NavigateToNewEventErrorAction> => Observable
        .fromPromise(this.router.navigate([ 'events', 'new' ]))
        .map(success => ({
          type: success ? 'NAVIGATE_TO_NEW_EVENT_SUCCESS' : 'NAVIGATE_TO_NEW_EVENT_ERROR'
        }))
    );

  @Effect() nevToEventList = this.actions
    .ofType('EVENT_MODAL_CLOSED')
    .switchMap((action): Observable<NavigateToEventsListSuccessAction | NavigateToEventsListErrorAction> => Observable
      .fromPromise(this.router.navigate([ 'events' ]))
      .map(success => ({
        type: success ? 'NAVIGATE_TO_EVENTS_LIST_SUCCESS' : 'NAVIGATE_TO_EVENTS_LIST_ERROR'
      }))
    );

  @Effect() routerEvents = this.router.events
    .map(extractEventId)
    .filter(eventId => eventId !== null)
    .map((eventId): NavigatedToEventsListAction | NavigatedToNewEventAction | NavigatedToEventAction => {
      if (eventId === '') {
        return {
          type: 'NAVIGATED_TO_EVENTS_LIST'
        }
      } else if (eventId === 'new') {
        return {
          type: 'NAVIGATED_TO_NEW_EVENT'
        }
      } else {
        return {
          type: 'NAVIGATED_TO_EVENT',
          payload: { eventId }
        }
      }
    });

  constructor(
    private actions: Actions,
    private router: Router,
  ) {
  }
}

function extractEventId(routerEvent: any): string | null {
  if (!(routerEvent instanceof NavigationEnd)) {
    return null;
  }

  const urlParts = routerEvent.urlAfterRedirects.split('/');

  if (urlParts.length < 2 || urlParts[ 1 ] !== 'events') {
    return null;
  }

  return urlParts[ 2 ] === undefined ? '' : urlParts[ 2 ];
}

export interface NavigatedToEventsListAction extends Action {
  type: 'NAVIGATED_TO_EVENTS_LIST';
}

export interface NavigatedToNewEventAction extends Action {
  type: 'NAVIGATED_TO_NEW_EVENT';
}

export interface NavigatedToEventAction extends Action {
  type: 'NAVIGATED_TO_EVENT';
  payload: {
    eventId: string;
  }
}

export interface NavigateToNewEventSuccessAction extends Action {
  type: 'NAVIGATE_TO_NEW_EVENT_SUCCESS';
}

export interface NavigateToNewEventErrorAction extends Action {
  type: 'NAVIGATE_TO_NEW_EVENT_ERROR';
}

export interface NavigateToEventsListSuccessAction extends Action {
  type: 'NAVIGATE_TO_EVENTS_LIST_SUCCESS';
}

export interface NavigateToEventsListErrorAction extends Action {
  type: 'NAVIGATE_TO_EVENTS_LIST_ERROR';
}
