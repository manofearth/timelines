//noinspection TypeScriptPreferShortImport
import {Subject} from '../../shared/rxjs';
import {TimelineCanDeactivateService} from './timeline-can-deactivate.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../reducers';
import {TimelineState} from './timeline.reducer';

describe('TimelineCanDeactivateService', () => {

  let stateChanges: Subject<TimelineState>;
  let mockStore: Store<AppState>;
  let guard: TimelineCanDeactivateService;

  beforeEach(() => {
    stateChanges = new Subject<TimelineState>();

    mockStore = <any> {
      select: () => stateChanges,
    };

    guard = new TimelineCanDeactivateService(mockStore);
  });

  it('should not allow deactivation if timeline saving', () => {
    guard.canDeactivate().subscribe((ignore: boolean) => {
      fail('should not allow deactivation if timeline saving');
    });

    stateChanges.next(<any> {isSaving: true});
  });

  it('should allow deactivation if timeline not saving', (done: DoneFn) => {
    guard.canDeactivate().subscribe((can: boolean) => {
      expect(can).toBe(true);
      done();
    });

    stateChanges.next(<any> {isSaving: false});
  });

});
