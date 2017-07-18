import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
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

  onEnterKey(e: KeyboardEvent) {
    if (this.searchResults.length === 0) {
      if (!this.isSearching) {
        // workaround for bug: https://github.com/ng-bootstrap/ng-bootstrap/issues/1252#issuecomment-294338294
        this.btnCreate.nativeElement.focus();
        this.onItemCreate();
      }
    } else {
      this.onItemSelect(this.highlightedIndex);
    }
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
    this.closeDropdown();
  }

  onItemSelect(index: number) {
    this.choose.emit(this.searchResults[index].item);
    this.closeDropdown();
  }

  onItemCreate(userInput: string) {
    this.emitCreateEvent(userInput);
  }

  private closeDropdown() {
    this.searchResults = [];
  }
}

const USER_INPUT_DEBOUNCE_TIME = 300;
