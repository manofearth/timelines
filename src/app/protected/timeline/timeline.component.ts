//noinspection TypeScriptPreferShortImport
import { Subscription } from '../../shared/rxjs';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { TimelineGetAction, TimelineState, Timeline, TimelineChangedAction } from './timeline.reducer';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { areEqual } from '../../shared/helpers';

@Component({
  selector: 'app-timeline',
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
  private stateSubscription: Subscription;
  private formChangesSubscription: Subscription;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private titleService: Title) { }

  ngOnInit() {

    this.routeParamsSubscription = this.route.params.subscribe((params: Params) => {
      this.store.dispatch(<TimelineGetAction>{
        type: 'ACTION_TIMELINE_GET',
        payload: params['id'],
      });
    });

    this.stateSubscription = this.store
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

  }

  ngOnDestroy() {
    this.routeParamsSubscription.unsubscribe();
    this.stateSubscription.unsubscribe();
  }

  private initForm(timeline: Timeline) {
    this.form = <TimelineForm>this.fb.group({
      title: timeline.title,
    });

    this.formChangesSubscription = this.form.valueChanges
      .subscribe((value: TimelineFormValue) => {
        this.store.dispatch(<TimelineChangedAction>{
          type: 'ACTION_TIMELINE_CHANGED',
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

function toFormValue(timeline: Timeline): TimelineFormValue {
  return {
    title: timeline.title,
  };
}

function toTimeline(oldTimeline: Timeline, formValue: TimelineFormValue): Timeline {
  return {
    id: oldTimeline.id,
    title: formValue.title,
  };
}
