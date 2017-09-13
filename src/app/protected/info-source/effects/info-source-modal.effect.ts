import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoSourceModalComponent } from '../info-source-modal.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import { Action } from '@ngrx/store';
import { of } from 'rxjs/observable/of';

@Injectable()
export class InfoSourceModalEffect {

  @Effect() effect: Observable<InfoSourceModalClosedAction> = this.actions
    .ofType('NAVIGATED_TO_NEW_INFO_SOURCE', 'NAVIGATED_TO_INFO_SOURCE')
    .mergeMap(() => Observable
      .fromPromise(this.modalService.open(InfoSourceModalComponent, { size: 'lg' }).result)
      .map((): InfoSourceModalClosedAction => ({
        type: 'INFO_SOURCE_MODAL_CLOSED'
      }))
      .catch((): Observable<InfoSourceModalClosedAction> => of({
        type: 'INFO_SOURCE_MODAL_CLOSED'
      }))
    );

  constructor(
    private actions: Actions,
    private modalService: NgbModal,
  ) {}
}

export interface InfoSourceModalClosedAction extends Action {
  type: 'INFO_SOURCE_MODAL_CLOSED';
}
