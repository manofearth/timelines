//noinspection TypeScriptPreferShortImport
import { Subscription } from '../../shared/rxjs';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { TimelineGetAction, TimelineState, Timeline, TimelineChangedAction } from './timeline.reducer';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventComponent } from '../event/event.component';
import { EventCreateAction, EventState } from '../event/event.reducer';

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

  private routeParamsSubscription: Subscription;
  private timelineStateSubscription: Subscription;
  private formChangesSubscription: Subscription;
  private timelineEventSubscription: Subscription;

  private timelineEventModal: NgbModalRef;

  //noinspection OverlyComplexFunctionJS
  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private titleService: Title,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {

    this.routeParamsSubscription = this.route.params.subscribe((params: Params) => {
      this.store.dispatch(<TimelineGetAction>{
        type: 'TIMELINE_GET',
        payload: params['id'],
      });
    });

    this.timelineStateSubscription = this.store
      .select('timeline')
      .filter((timeline: TimelineState): boolean => timeline.timeline !== null)
      .subscribe((timeline: TimelineState) => {
        this.isLoading = timeline.isLoading;
        this.isSaving = timeline.isSaving;
        this.error = timeline.error;
        this.timeline = timeline.timeline;

        this.updateTitle();

        if (!this.form) {
          this.initForm(timeline.timeline);
        }

        this.changeDetector.markForCheck();

      });

    this.timelineEventSubscription = this.store
      .select('event')
      .subscribe((event: EventState) => {
        if (event && !this.timelineEventModal) {
          this.timelineEventModal = this.modalService.open(EventComponent, { size: 'lg' });
          this.timelineEventModal.result.then(
            () => {
              console.log('resolve');
              this.timelineEventModal = null;
            },
            () => {
              this.timelineEventModal = null;
            });
        } else if (!event && this.timelineEventModal) {
          this.timelineEventModal.close();
          this.timelineEventModal = null;
        }
      });

  }

  ngOnDestroy() {
    this.routeParamsSubscription.unsubscribe();
    this.timelineStateSubscription.unsubscribe();
    this.timelineEventSubscription.unsubscribe();
  }

  createTimelineEvent(title: string) {
    this.store.dispatch(<EventCreateAction>{
      type: 'EVENT_CREATE',
      payload: title,
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

function toTimeline(oldTimeline: Timeline, formValue: TimelineFormValue): Timeline {
  return {
    id: oldTimeline.id,
    title: formValue.title,
  };
}
