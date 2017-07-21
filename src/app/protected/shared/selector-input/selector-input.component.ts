import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { SelectorSearchService } from './selector-search.service';
import { SelectorSearchResultItem } from './selector-search-result-item';
import { SelectorListComponent } from '../selector-list/selector-list.component';

@Component({
  selector: 'tl-selector',
  templateUrl: './selector-input.component.html',
  styleUrls: ['./selector-input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorInputComponent implements OnInit, OnDestroy {

  @Output() create: EventEmitter<string> = new EventEmitter<string>();
  @Output() choose: EventEmitter<any> = new EventEmitter<any>();

  @Input() placeholder: string;
  @Input() searchService: SelectorSearchService;

  @ViewChild('list') list: SelectorListComponent;

  searchResults: SelectorSearchResultItem[] = [];

  private searchResultsSub: Subscription;

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.searchResultsSub = this.searchService.results$.subscribe((results: SelectorSearchResultItem[]) => {
      this.searchResults = results;
      this.changeDetector.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.searchResultsSub.unsubscribe();
  }

  onEnterKey() {
    this.onItemSelect(this.list.highlightedItem);
  }

  onEscKey() {
    this.searchService.toInitialSearchState();
  }

  onArrowDownKey() {
    this.list.highlightNext();
  }

  onArrowUpKey() {
    this.list.highlightPrev();
  }

  onItemSelect(item: SelectorSearchResultItem) {
    this.choose.emit(item);
    this.searchService.toInitialSearchState();
  }

  onItemCreate(userInput: string) {
    this.create.emit(userInput);
    this.searchService.toInitialSearchState();
  }
}
