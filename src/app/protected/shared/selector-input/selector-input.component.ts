import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../../../reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'tl-selector',
  templateUrl: './selector-input.component.html',
  styleUrls: ['./selector-input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorInputComponent implements OnInit {

  @Input() name: string;
  @Input() placeholder: string;

  show$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
  ) {
  }

  ngOnInit() {

    this.store.dispatch({
      type: 'SELECTOR_INIT',
      payload: {
        name: this.name,
      }
    });

    this.show$ = this.store.select(this.hasSearchResults.bind(this));
  }

  hasSearchResults(state: AppState): boolean {
    if (state.selectors[this.name]) {
      return state.selectors[this.name].results.length !== 0;
    } else {
      return false;
    }
  }
}
