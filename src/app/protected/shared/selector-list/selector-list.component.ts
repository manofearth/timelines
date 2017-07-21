import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectorListItem } from './selector-list-item';

@Component({
  selector: 'tl-selector-list',
  templateUrl: './selector-list.component.html',
  styleUrls: ['./selector-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorListComponent {

  @Output() select = new EventEmitter<SelectorListItem>();

  private _data: SelectorListItem[] = [];
  private highlightedIndex: number = 0;

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  @Input()
  set data(data: SelectorListItem[]) {
    this._data = data;
    this.changeDetector.markForCheck();
  }

  get data() {
    return this._data;
  }

  highlightNext() {
    this.highlightedIndex++;
    if (this.highlightedIndex >= this.data.length) {
      this.highlightedIndex = 0;
    }
    this.changeDetector.markForCheck();
  }

  highlightPrev() {
    this.highlightedIndex--;
    if (this.highlightedIndex < 0) {
      this.highlightedIndex = this.data.length - 1;
    }
    this.changeDetector.markForCheck();
  }

  get highlightedItem(): SelectorListItem {
    return this.data[this.highlightedIndex].item;
  }

  onItemSelect(item: SelectorListItem) {
    this.select.next(item);
  }

}
