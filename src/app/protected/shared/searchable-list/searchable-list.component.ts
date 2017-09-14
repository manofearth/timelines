import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../../../reducers';
import { SearchableListState } from './searchable-list.reducer';
import { SelectorInputBlurEffect } from '../selector-input/selector-input-blur.effect';

@Component({
  selector: 'tl-searchable-list',
  templateUrl: './searchable-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchableListComponent implements OnInit, OnDestroy {

  @Input() name: string;
  @Input() stateSelector: (state: AppState) => SearchableListState<any>;

  constructor(private blurEffect: SelectorInputBlurEffect) {
  }

  ngOnInit() {
    this.blurEffect.registerSelect(this.name);
  }

  ngOnDestroy() {
    this.blurEffect.unregisterSelect(this.name);
  }
}
