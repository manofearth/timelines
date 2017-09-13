import { Component, OnInit } from '@angular/core';
import { AppState } from '../../reducers';
import { Action, Store } from '@ngrx/store';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { InfoSource, InfoSourceModalStatus } from './info-source-modal.reducer';

@Component({
  selector: 'tl-info-source-modal',
  templateUrl: './info-source-modal.component.html',
  styleUrls: ['./info-source-modal.component.css']
})
export class InfoSourceModalComponent implements OnInit {

  titleInputName: string = INFO_SOURCE_MODAL_TITLE_INPUT_NAME;

  status$: Observable<InfoSourceModalStatus>;
  isTitleEmpty$: Observable<boolean>;

  isDeleteConfirmationVisible: boolean = false;

  constructor(
    private store: Store<AppState>,
    public modal: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.status$ = this.store.select(state => state.infoSourceModal.status);
    this.isTitleEmpty$ = this.store.select(state => state.infoSourceModal.infoSource.title.length === 0);
  }

  onDeleteButtonClick() {
    this.isDeleteConfirmationVisible = true;
  }

  onDeleteConfirmNoClick() {
    this.isDeleteConfirmationVisible = false;
  }

  onDeleteConfirmYesClick() {

  }

  onSaveButtonClick() {
    this.store.select<InfoSource>(state => state.infoSourceModal.infoSource).take(1).subscribe(infoSource => {
      const action: InfoSourceModalSaveButtonAction = {
        type: 'INFO_SOURCE_MODAL_SAVE_BUTTON',
        payload: {
          infoSource: infoSource,
        }
      };
      this.store.dispatch(action);
      this.modal.close();
    });
  }

  selectTitle(state: AppState) {
    return state.infoSourceModal.infoSource.title;
  }
}

export const INFO_SOURCE_MODAL_TITLE_INPUT_NAME = 'info-source-modal-title';

export interface InfoSourceModalSaveButtonAction extends Action {
  type: 'INFO_SOURCE_MODAL_SAVE_BUTTON';
  payload: {
    infoSource: InfoSource;
  }
}
