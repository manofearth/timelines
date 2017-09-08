import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventComponent } from '../event.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import { Action } from '@ngrx/store';
import { of } from 'rxjs/observable/of';

@Injectable()
export class EventModalEffect {

  @Effect() effect: Observable<EventModalClosedAction> = this.router.events
    .filter(isNavigationToEventModal)
    .mergeMap(() => Observable
      .fromPromise(this.modalService.open(EventComponent, { size: 'lg' }).result)
      .map((): EventModalClosedAction => ({
        type: 'EVENT_MODAL_CLOSED'
      }))
      .catch((): Observable<EventModalClosedAction> => of({
        type: 'EVENT_MODAL_CLOSED'
      }))
    );

  constructor(
    private router: Router,
    private modalService: NgbModal,
  ) {}
}

export interface EventModalClosedAction extends Action {
  type: 'EVENT_MODAL_CLOSED';
}

function isNavigationToEventModal(routerEvent: any) {
  if (!(routerEvent instanceof NavigationEnd)) {
    return;
  }

  const urlParts = routerEvent.urlAfterRedirects.split('/');

  if (urlParts.length < 3) {
    return false;
  }

  return urlParts[ 1 ] === 'events';
}
