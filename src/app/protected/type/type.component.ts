import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppState } from '../../reducers';
import { Store } from '@ngrx/store';
import { TimelineEventsType, TypeKind, TypeState, TypeStateStatus } from './type-states';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TypeUpdateAction } from './type-update-actions';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';

@Component({
  selector: 'tl-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeComponent implements OnInit, OnDestroy {

  form: TypeForm;

  kindsTitles: { [kind in TypeKind]: string } = {
    'period': 'Период',
    'date': 'Дата'
  };
  kinds: TypeKind[] = Object.keys(this.kindsTitles) as TypeKind[];

  private state: TypeState;
  private stateSub: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private changeDetector: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.stateSub = this.store.select<TypeState>('type').subscribe(state => {
      this.state = state;

      if (this.state.type) {
        this.initForm(this.state.type);
        this.changeDetector.markForCheck();
      }
    });
  }

  ngOnDestroy() {
    this.stateSub.unsubscribe();
  }

  save() {

    this.dispatchUpdate();

    this.store.select<TypeStateStatus>('type', 'status')
      .filter(status => status === 'idle' || status === 'error')
      .take(1)
      .subscribe(() => {
        this.activeModal.close();
      });
  }

  private dispatchUpdate() {
    const action: TypeUpdateAction = {
      type: 'TYPE_UPDATE',
      payload: {
        id: this.state.type.id,
        data: this.form.value,
      }
    };

    this.store.dispatch(action);
  }

  private initForm(type: TimelineEventsType) {
    this.form = <TypeForm> this.fb.group({
      title: type.title,
      kind: type.kind,
    });
  }
}

interface TypeForm extends FormGroup {
  controls: {
    title: FormControl;
    kind: FormControl;
  }
  value: TypeFormValue;
}

interface TypeFormValue {
  title: string;
  kind: TypeKind;
}
