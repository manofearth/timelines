import { Observable } from '../../shared/rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineComponent } from './timeline.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { TimelineState, TimelineGetAction } from './timeline.reducer';
import { AppState } from '../../reducers/index';

describe('TimelineComponent', () => {
  describe('Isolated', () => {
    let mockStore: Store<AppState>;
    let component: TimelineComponent;
    let mockRoute: ActivatedRoute;

    beforeEach(() => {
      mockStore = <any> {
        dispatch: () => {
        },
        select: () => Observable.of({}),
      };
      mockRoute = <any> {
        params: Observable.of({}),
      };
      component = new TimelineComponent(mockStore, mockRoute);
    });

    it('ngOnInit() should dispatch ACTION_TIMELINE_GET', () => {
      spyOn(mockStore, 'dispatch');
      mockRoute.params = Observable.of({ id: 'some id'});
      component.ngOnInit();
      expect(mockStore.dispatch).toHaveBeenCalledWith(<TimelineGetAction>{
        type: 'ACTION_TIMELINE_GET',
        payload: 'some id',
      });
    });
  });

  describe('Shallow', () => {
    let component: TimelineComponent;
    let fixture: ComponentFixture<TimelineComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [RouterModule.forRoot([])],
        declarations: [TimelineComponent],
        providers: [
          {
            provide: Store,
            useValue: {
              select: () => Observable.of(<TimelineState>{
                isLoading: true,
                error: new Error('some error'),
                timeline: {},
              }),
              dispatch: () => {
              },
            }
          },
          {
            provide: APP_BASE_HREF,
            useValue: '/',
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TimelineComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(fixture.nativeElement.textContent).toContain('some error');
      expect(fixture.nativeElement.textContent).toContain('Загружается...');
    });
  });
});
