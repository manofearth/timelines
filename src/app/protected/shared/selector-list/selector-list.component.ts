import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectorListItem } from './selector-list-item';
import { SelectorListService } from './selector-list-service';

@Component({
  selector: 'tl-selector-list',
  templateUrl: './selector-list.component.html',
  styleUrls: ['./selector-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorListComponent {

  @Input() service: SelectorListService;

  @Output() select = new EventEmitter<SelectorListItem>();

  constructor() {
  }

  onItemSelect(item: SelectorListItem) {
    this.select.next(item);
  }

}
