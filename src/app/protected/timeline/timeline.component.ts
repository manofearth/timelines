//noinspection TypeScriptPreferShortImport
import { Subscription } from '../../shared/rxjs';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { TimelineGetAction, TimelineState, Timeline, TimelineChangedAction } from './timeline.reducer';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent implements OnInit, OnDestroy {

  timeline: Timeline;
  isLoading: boolean;
  error: Error;
  form: TimelineForm;

  private routeParamsSubscription: Subscription;
  private stateSubscription: Subscription;
  private formChangesSubscription: Subscription;

  private readonly FORM_VALUE_CHANGES_DEBOUNCE_TIME: number = 1000;

  constructor(private store: Store<AppState>,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private changeDetector: ChangeDetectorRef,) {
  }

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
      this.error = timeline.error;
      this.timeline = timeline.timeline;

      if (timeline.timeline) {
        this.form.setValue(toFormValue(timeline.timeline), { emitEvent: false });
      }

      this.changeDetector.markForCheck();

    });

  }

  ngOnDestroy() {
    this.routeParamsSubscription.unsubscribe();
    this.stateSubscription.unsubscribe();
  }

  private initForm() {
    this.form = <TimelineForm> this.fb.group({
      title: null,
    });

    this.formChangesSubscription = this.form.valueChanges
      .debounceTime(this.FORM_VALUE_CHANGES_DEBOUNCE_TIME)
      .distinctUntilChanged()
      .subscribe((value: TimelineFormValue) => {
        this.store.dispatch(<TimelineChangedAction> {
          type: 'ACTION_TIMELINE_CHANGED',
          payload: value,
        });
      });
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
