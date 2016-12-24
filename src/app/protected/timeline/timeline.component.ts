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

    this.initForm();

    this.routeParamsSubscription = this.route.params.subscribe((params: Params) => {
      this.store.dispatch(<TimelineGetAction>{
        type: 'ACTION_TIMELINE_GET',
        payload: params['id'],
      });
    });

    this.stateSubscription = this.store.select('timeline').subscribe((timeline: TimelineState) => {
      this.isLoading = timeline.isLoading;
      this.isSaving = timeline.isSaving;
      this.error = timeline.error;
      this.timeline = timeline.timeline;

      if (timeline.timeline) {
        this.updateForm();
        this.updateTitle();
      }

      this.changeDetector.markForCheck();

    });

  }

  ngOnDestroy() {
    this.routeParamsSubscription.unsubscribe();
    this.stateSubscription.unsubscribe();
  }

  private initForm() {
    this.form = <TimelineForm>this.fb.group({
      title: null,
    });

    this.formChangesSubscription = this.form.valueChanges
      .subscribe((value: TimelineFormValue) => {
        this.store.dispatch(<TimelineChangedAction>{
          type: 'ACTION_TIMELINE_CHANGED',
          payload: toTimeline(this.timeline, value),
        });
      });
  }

  private updateForm() {

    const newFormValue: TimelineFormValue = toFormValue(this.timeline);

    if (!areEqual(this.form.value, newFormValue)) {
      this.form.setValue(newFormValue, { emitEvent: false });
    }
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
