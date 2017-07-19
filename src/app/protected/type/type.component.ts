import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppState } from '../../reducers';
import { Store } from '@ngrx/store';
import { TypeState } from './type-states';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'tl-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeComponent implements OnInit, OnDestroy {

  private state: TypeState;
  private stateSub: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store<AppState>,
  ) {
  }

  ngOnInit() {
    this.stateSub = this.store.select<TypeState>('type').subscribe(state => {
      this.state = state;
    });
  }

  ngOnDestroy() {
    this.stateSub.unsubscribe();
  }

  save() {

  }

}
