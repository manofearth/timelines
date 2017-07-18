import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { SelectorSearchService } from './selector-search.service';
import { SelectorSearchResultItem } from './selector-search-result-item';

@Component({
  selector: 'tl-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorComponent implements OnInit, OnDestroy {

  @Output('create') create: EventEmitter<string> = new EventEmitter<string>();
  @Output('choose') choose: EventEmitter<any> = new EventEmitter<any>();

  @Input('placeholder') placeholder: string;
  @Input('searchService') searchService: SelectorSearchService;

  searchResults: SelectorSearchResultItem[] = [];
  highlightedIndex: number;

  private searchResultsSub: Subscription;

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.searchResultsSub = this.searchService.results$.subscribe((results: SelectorSearchResultItem[]) => {
      this.searchResults = results;
      this.highlightedIndex = 0;
      this.changeDetector.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.searchResultsSub.unsubscribe();
  }

  emitCreateEvent(userInput: string) {
    this.create.emit(userInput);
  }

  emitSelectEvent(index: number) {
    this.choose.emit(this.searchResults[index].item);
  }

  onEnterKey() {
    this.onItemSelect(this.highlightedIndex);
  }

  onArrowDownKey() {
    this.highlightedIndex++;
    if (this.highlightedIndex >= this.searchResults.length) {
      this.highlightedIndex = 0;
    }
    this.changeDetector.markForCheck();
  }

  onArrowUpKey() {
    this.highlightedIndex--;
    if (this.highlightedIndex < 0) {
      this.highlightedIndex = this.searchResults.length - 1;
    }
    this.changeDetector.markForCheck();
  }

  onEscKey() {
    this.toInitialSearchState();
  }

  onItemSelect(index: number) {
    this.emitSelectEvent(index);
    this.toInitialSearchState();
  }

  onItemCreate(userInput: string) {
    this.emitCreateEvent(userInput);
    this.toInitialSearchState();
  }

  private toInitialSearchState() {
    this.searchService.toInitialSearchState();
  }
}
