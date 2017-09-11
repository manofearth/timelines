import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventComponent } from '../event.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import { Action } from '@ngrx/store';
import { of } from 'rxjs/observable/of';

@Injectable()
export class EventModalEffect {

  @Effect() effect: Observable<EventModalClosedAction> = this.actions
    .ofType('NAVIGATED_TO_NEW_EVENT', 'NAVIGATED_TO_EVENT')
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
    private actions: Actions,
    private modalService: NgbModal,
  ) {}
}

export interface EventModalClosedAction extends Action {
  type: 'EVENT_MODAL_CLOSED';
}
