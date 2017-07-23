import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import 'rxjs/add/operator/map';
import { SelectorSearchService } from './selector-search.service';
import { SelectorSearchResultItem } from './selector-search-result-item';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'tl-selector',
  templateUrl: './selector-input.component.html',
  styleUrls: ['./selector-input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorInputComponent implements OnInit {

  @Output() create: EventEmitter<string> = new EventEmitter<string>();
  @Output() choose: EventEmitter<any> = new EventEmitter<any>();

  @Input() placeholder: string;
  @Input() service: SelectorSearchService;

  show$: Observable<boolean>;

  ngOnInit() {
    this.show$ = this.service.results$.map(results => results.length > 0);
  }

  onEnterKey() {
    this.onItemSelect(this.list.highlightedItem);
  }

  onEscKey() {
    this.service.toInitialSearchState();
  }

  onItemSelect(item: SelectorSearchResultItem) {
    this.choose.emit(item);
    this.service.toInitialSearchState();
  }

  onItemCreate(userInput: string) {
    this.create.emit(userInput);
    this.service.toInitialSearchState();
  }
}
