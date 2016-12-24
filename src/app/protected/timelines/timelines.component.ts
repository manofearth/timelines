//noinspection TypeScriptPreferShortImport
import { Subscription } from '../../shared/rxjs';
import {
  Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, TemplateRef,
  ViewChild
} from '@angular/core';
import { Store } from '@ngrx/store';
import { TimelinesGetAction, TimelinesState, TimelinesCreateAction, TimelinesDeleteAction } from './timelines.reducer';
import { AppState } from '../../reducers';
import { Router } from '@angular/router';
import { Timeline } from '../timeline/timeline.reducer';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-timelines',
  templateUrl: './timelines.component.html',
  styleUrls: ['./timelines.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelinesComponent implements OnInit, OnDestroy {

  modeOpenNew: boolean = false;
  timelines: Timeline[];
  error: Error;
  isLoading: boolean;
  timelineToDelete: Timeline;

  @ViewChild('deleteDialogTemplate') deleteDialogTemplate: TemplateRef<any>;

  private timelinesSubscription: Subscription;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private ngbModal: NgbModal,
    private titleService: Title,
  ) {
  }

  ngOnInit() {

    this.titleService.setTitle('Timelines');

    this.timelinesSubscription = this.store.select<TimelinesState>('timelines').subscribe((state: TimelinesState) => {
      this.timelines = state.timelines;
      this.error = state.error;
      this.isLoading = state.isLoading;

      if (this.modeOpenNew && state.newTimelineId) {
        this.modeOpenNew = false;
        this.router.navigate(['/timeline/' + state.newTimelineId]);
      }

      this.changeDetector.markForCheck();

    });

    this.store.dispatch(<TimelinesGetAction>{
      type: 'ACTION_TIMELINES_GET'
    });
  }

  ngOnDestroy() {
    this.timelinesSubscription.unsubscribe();
  }

  create() {
    this.modeOpenNew = true;
    this.store.dispatch(<TimelinesCreateAction>{
      type: 'ACTION_TIMELINES_CREATE',
    });
  }

  confirmDeletion(timeline: Timeline) {

    this.timelineToDelete = timeline;

    this.ngbModal.open(this.deleteDialogTemplate).result.then((confirmed: boolean) => {
      if (confirmed === false) {
        return;
      }

      this.store.dispatch(<TimelinesDeleteAction>{
        type: 'ACTION_TIMELINES_DELETE',
        payload: timeline,
      });

      this.timelineToDelete = null;
    });
  }
}
