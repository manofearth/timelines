import {Observable} from '../../shared/rxjs';
import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';
import {TimelineComponent} from './timeline.component';
import {Store} from '@ngrx/store';
import {AppState} from '../../reducers';
import {TimelineState} from './timeline.reducer';

@Injectable()
export class TimelineCanDeactivate implements CanDeactivate<TimelineComponent> {

  constructor(private store: Store<AppState>) {
  }

  canDeactivate(): Observable<boolean> {
    return this.store.select('timeline')
      .filter((timeline: TimelineState) => !timeline.isSaving)
      .take(1)
      .map((timeline: TimelineState) => true);
  }
}
