import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelinesComponent } from './timelines.component';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AppState } from '../../reducers/index';
import { TimelinesGetAction } from '../../reducers/timelines.reducer';

describe('TimelinesComponent', () => {

  describe('Isolated', () => {

    let store: Store<AppState>;
    let component: TimelinesComponent;

    beforeEach(() => {
      store = <any> {
        dispatch: () => {
        },
        select: () => {
        },
      };
      component = new TimelinesComponent(store);
    });

    it('ngOnInit() should dispatch ACTION_TIMELINES_GET', () => {
      spyOn(store, 'dispatch');
      component.ngOnInit();
      expect(store.dispatch).toHaveBeenCalledWith(<TimelinesGetAction>{
        type: 'ACTION_TIMELINES_GET',
      });
    });

  });

  describe('Shallow', () => {
    let component: TimelinesComponent;
    let fixture: ComponentFixture<TimelinesComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [TimelinesComponent],
        providers: [
          {
            provide: Store,
            useValue: {
              select: () => Observable.of([
                { title: 'Timeline 1' },
                { title: 'Timeline 2' },
              ]),
              dispatch: () => {
              },
            },
          },
          { provide: Router, useValue: {} },
        ]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TimelinesComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      const rows: HTMLTableRowElement[] = fixture.nativeElement.querySelectorAll('tr');
      expect(rows[0].textContent).toContain('Timeline 1');
      expect(rows[1].textContent).toContain('Timeline 2');
    });

  });
});
