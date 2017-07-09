//noinspection TypeScriptPreferShortImport
import { Subscription } from '../../shared/rxjs';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { TimelineChangedAction, TimelineGetAction } from './timeline-actions';
import { Timeline, TimelineChangedPayload, TimelineEventForTimeline, TimelineState } from './timeline-states';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventComponent } from '../event/event.component';
import { EventCreateAction, EventDetachAction, EventEraseAction, EventGetAction } from '../event/event-actions';
import { TimelineEventsSearchService } from './timeline-events-search.service';
import { EventAttachToTimelineAction } from '../event/event-actions';

@Component({
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent implements OnInit, OnDestroy {

  timeline: Timeline;
  isLoading: boolean;
  isSaving: boolean;
  error: Error;
  form: TimelineForm;

  private timelineStateSubscription: Subscription;
  private formChangesSubscription: Subscription;

  //noinspection OverlyComplexFunctionJS
  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private titleService: Title,
    private modalService: NgbModal,
    public eventsSearchService: TimelineEventsSearchService,
  ) {
  }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.store.dispatch(<TimelineGetAction>{
        type: 'TIMELINE_GET',
        payload: params['id'],
      });
    }); // no need to unsubscribe router observables - router takes care of it

    this.timelineStateSubscription = this.store
      .select('timeline')
      .subscribe((timeline: TimelineState) => {
        this.isLoading = timeline.isLoading;
        this.isSaving = timeline.isSaving;
        this.error = timeline.error;
        this.timeline = timeline.timeline;

        if (this.timeline) {
          this.updateTitle();

          if (!this.form) {
            this.initForm(timeline.timeline);
          }
        }

        this.changeDetector.markForCheck();

      });

  }

  ngOnDestroy() {
    this.timelineStateSubscription.unsubscribe();
  }

  createAndOpenTimelineEvent(title: string) {
    this.store.dispatch(<EventCreateAction>{
      type: 'EVENT_CREATE',
      payload: title,
    });

    const modal = this.modalService.open(EventComponent, { size: 'lg' });
    modal.result.then(
      () => {
        this.dispatchEventEraseAction();
      },
      () => {
        this.dispatchEventEraseAction();
      },
    );
    modal.componentInstance.attachToTimeline = this.timeline;
  }

  openTimelineEvent(id: string) {
    this.store.dispatch(<EventGetAction> {
      type: 'EVENT_GET',
      payload: id,
    });
    this.modalService.open(EventComponent, { size: 'lg' }).result.then(
      () => {
        // refresh timeline events by getting whole timeline from base
        this.store.dispatch(<TimelineGetAction> {
          type: 'TIMELINE_GET',
          payload: this.timeline.id,
        });
        this.dispatchEventEraseAction();
      },
      () => {
        this.dispatchEventEraseAction();
      },
    );
  }

  detachEvent(event: TimelineEventForTimeline) {
    this.store.dispatch(<EventDetachAction> {
      type: 'EVENT_DETACH',
      payload: {
        timelineId: this.timeline.id,
        eventId: event.id,
      }
    });
  }

  onBarSelect(event: TimelineEventForTimeline) {
    this.openTimelineEvent(event.id);
  }

  dispatchAttachToTimelineAction(eventId: string) {
    this.store.dispatch(<EventAttachToTimelineAction> {
      type: 'EVENT_ATTACH_TO_TIMELINE',
      payload: {
        timelineId: this.timeline.id,
        eventId: eventId,
      }
    });
  }

  private dispatchEventEraseAction() {
    this.store.dispatch(<EventEraseAction> {
      type: 'EVENT_ERASE',
    });
  }

  private initForm(timeline: Timeline) {
    this.form = <TimelineForm>this.fb.group({
      title: timeline.title,
    });

    this.formChangesSubscription = this.form.valueChanges
      .subscribe((value: TimelineFormValue) => {
        this.store.dispatch(<TimelineChangedAction>{
          type: 'TIMELINE_CHANGED',
          payload: toTimeline(this.timeline, value),
        });
      });
  }

  private updateTitle() {
    this.titleService.setTitle((this.isSaving ? '*' : '') + this.timeline.title);
  }

}

export interface TimelineForm extends FormGroup {
  controls: {
    title: FormControl;
  };
}

export interface TimelineFormValue {
  title: string;
}

function toTimeline(oldTimeline: Timeline, formValue: TimelineFormValue): TimelineChangedPayload {
  return {
    id: oldTimeline.id,
    title: formValue.title,
  };
}
