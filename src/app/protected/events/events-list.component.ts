import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../../reducers';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { getProp } from '../shared/helpers';
import { TimelineEventForList } from './events-list.reducer';
import { ComponentInitAction } from '../../shared/component-init-action';
import { Actions } from '@ngrx/effects';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchFieldCreateAction } from '../shared/search-field/search-field-actions';
import { actionNameIs } from '../../shared/action-name-is.fn';
import { Subscription } from 'rxjs/Subscription';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventComponent } from '../event/event.component';
import 'rxjs/add/operator/delay';

@Component({
  selector: 'tl-events',
  templateUrl: './events-list.component.html',
  styleUrls: [ './events-list.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsListComponent implements OnInit, OnDestroy {

  isSearching$: Observable<boolean>;
  searchQuery$: Observable<string>;
  hasError$: Observable<boolean>;
  errorMessage$: Observable<string>;
  isLoading$: Observable<boolean>;
  list$: Observable<TimelineEventForList[]>;

  searchFieldName: string = EVENTS_LIST_SEARCH_FIELD_NAME;

  private navigateToNewSub: Subscription;
  private routeParamsSub: Subscription;

  constructor(
    private store: Store<AppState>,
    private actions: Actions,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
  ) {
    console.log('construct');
  }

  ngOnInit() {
    console.log('init');
    this.isSearching$ = this.store.select<boolean>(state => state.eventsList.isSearching);
    this.searchQuery$ = this.store.select<string>(state => state.eventsList.query);
    this.hasError$ = this.store.select<boolean>(state => state.eventsList.error !== null);
    this.errorMessage$ = this.store.select<string>(state => getProp(state.eventsList.error, 'message', ''));
    this.isLoading$ = this.store.select<boolean>(state => state.eventsList.isLoading);
    this.list$ = this.store.select<TimelineEventForList[]>(state => state.eventsList.list);

    this.navigateToNewSub = this.actions
      .ofType('SEARCH_FIELD_CREATE')
      .filter<SearchFieldCreateAction>(actionNameIs(EVENTS_LIST_SEARCH_FIELD_NAME))
      .subscribe(() => {
        // noinspection JSIgnoredPromiseFromCall
        this.router.navigate([ 'events', 'new' ]);
      });

    this.routeParamsSub = this.route.children[0].params
    // have to delay to next tick, because in case of user navigation with direct link,
    // got ExpressionChangedAfterItHasBeenCheckedError after attempt to open modal
      .delay(0)
      .subscribe(params => {
        if (params[ 'id' ]) {
          this.dispatchNavigatedToEvent(params[ 'id' ]);
          this.openEventModal();
        }
      });

    this.dispatchInit();
  }

  ngOnDestroy() {
    this.navigateToNewSub.unsubscribe();
    this.routeParamsSub.unsubscribe();
    console.log('destruct');
  }

  private dispatchInit() {
    const action: ComponentInitAction = {
      type: 'COMPONENT_INIT',
      payload: {
        name: EVENTS_LIST_COMPONENT_NAME
      }
    };
    this.store.dispatch(action);
  }

  private openEventModal() {
    const changeUrl = () => {
      // noinspection JSIgnoredPromiseFromCall
      this.router.navigate(['events'])
    };
    this.modalService.open(EventComponent, { size: 'lg' }).result.then(changeUrl, changeUrl);
  }

  private dispatchNavigatedToEvent(eventId: string) {
    const action: EventsListNavigatedToEventAction = {
      type: 'EVENTS_LIST_NAVIGATED_TO_EVENT',
      payload: {
        eventId: eventId,
      }
    };
    this.store.dispatch(action);
  }
}

export interface EventsListNavigatedToEventAction extends Action {
  type: 'EVENTS_LIST_NAVIGATED_TO_EVENT';
  payload: {
    eventId: string;
  }
}

export const EVENTS_LIST_SEARCH_FIELD_NAME = 'events-list-search-field';
export const EVENTS_LIST_COMPONENT_NAME = 'events-list-component';
