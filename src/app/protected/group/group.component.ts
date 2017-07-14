import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { TimelineEventsGroup } from '../timeline/timeline-states';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/map';
import { TimelineSaveGroupAction } from '../timeline/timeline-actions';

@Component({
  templateUrl: './group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupComponent implements OnInit {

  @Input() timelineId: string;
  @Input() groupId: string;

  form: TimelineGroupForm;

  availableColors: string[] = AVAILABLE_COLORS;

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private changeDetector: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.store.select('timeline', 'timeline', 'groups')
      .map((groups: TimelineEventsGroup[]) => groups.filter(group => group.id === this.groupId)[0])
      .subscribe((group: TimelineEventsGroup) => {
        if (group) {
          this.initForm(group);
          this.changeDetector.markForCheck();
        }
      });
  }

  save() {
    const action: TimelineSaveGroupAction = {
      type: 'TIMELINE_SAVE_GROUP',
      payload: {
        timelineId: this.timelineId,
        groupId: this.groupId,
        data: this.form.value,
      }
    };

    this.store.dispatch(action);

    this.activeModal.close();
  }

  private initForm(group: TimelineEventsGroup) {
    this.form = this.fb.group({
      title: group.title,
      color: group.color,
    }) as TimelineGroupForm;
  }
}

interface TimelineGroupForm extends FormGroup {
  controls: {
    title: FormControl;
    color: FormControl;
  },
  value: {
    title: string;
    color: string;
  }
}

const AVAILABLE_COLORS = [
  'cornflowerblue',
  'orange',
  'darkorchid',
  'lightcoral',
  'lightpink',
  'lightblue',
  'lightsalmon',
  'lightseagreen',
  'lightskyblue',
];
