import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../../../reducers';
import { Store } from '@ngrx/store';
import { SelectorListItem } from '../selector-list/selector-list-item';
import { SelectorInputState } from './selector-input-state';
import { SelectorInputInitAction } from './selector-input-actions';
import { SelectorInputBlurEffect } from './selector-input-blur.effect';

@Component({
  selector: 'tl-selector-input',
  templateUrl: './selector-input.component.html',
  styleUrls: [ './selector-input.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorInputComponent implements OnInit, OnDestroy {

  @Input() name: string;
  @Input() placeholder: string;
  @Input() stateSelector: (state: AppState) => SelectorInputState<any>;

  show$: Observable<boolean>;
  results$: Observable<SelectorListItem<any>[]>;
  highlightedIndex$: Observable<number>;

  constructor(
    private store: Store<AppState>,
    private blurEffect: SelectorInputBlurEffect,
  ) {
  }

  ngOnInit() {

    this.dispatchInitAction();

    this.show$ = this.store.select<boolean>(state => this.stateSelector(state).results.length !== 0);
    this.results$ = this.store.select<SelectorListItem<any>[]>(state => this.stateSelector(state).results);
    this.highlightedIndex$ = this.store.select<number>(state => this.stateSelector(state).highlightedIndex);

    this.blurEffect.registerSelect(this.name);
  }

  ngOnDestroy() {
    this.blurEffect.unregisterSelect(this.name);
  }

  private dispatchInitAction() {
    const action: SelectorInputInitAction = {
      type: 'SELECTOR_INPUT_INIT',
      payload: {
        name: this.name,
      }
    };
    this.store.dispatch(action);
  }
}
