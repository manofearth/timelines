import { Observable, Subject } from '../../shared/rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineComponent } from './timeline.component';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { TimelineState, TimelineGetAction } from './timeline.reducer';
import { AppState } from '../../reducers';
import { Title } from '@angular/platform-browser';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventComponent } from '../event/event.component';

describe('TimelineComponent', () => {

  describe('Isolated', () => {
    let mockStore: Store<AppState>;
    let component: TimelineComponent;
    let mockRoute: ActivatedRoute;
    let mockTitleService: Title;
    let stateChanges = new Subject();
    let mockModalService: NgbModal;

    beforeEach(() => {
      stateChanges = new Subject();
      mockStore = <any>{
        dispatch: () => {
        },
        select: () => stateChanges,
      };
      mockRoute = <any>{
        params: Observable.of({}),
      };
      mockTitleService = <any>{
        setTitle: () => {
        },
      };
      mockModalService = <any>{
        open: () => {
        },
      };
      const mockChangeDetector: ChangeDetectorRef = <any>{
        markForCheck: () => {
        },
      };
      const formBuilder: FormBuilder = new FormBuilder();

      component = new TimelineComponent(mockStore, mockRoute, formBuilder, mockChangeDetector, mockTitleService, mockModalService);
    });

    it('ngOnInit() should dispatch TIMELINE_GET', () => {
      spyOn(mockStore, 'dispatch');
      mockRoute.params = Observable.of({ id: 'some id' });
      component.ngOnInit();
      expect(mockStore.dispatch).toHaveBeenCalledWith(<TimelineGetAction>{
        type: 'TIMELINE_GET',
        payload: 'some id',
      });
    });

    it('should update title', () => {
      const spySetTitle: jasmine.Spy = spyOn(mockTitleService, 'setTitle');
      component.ngOnInit();

      stateChanges.next({
        timeline: { title: 'some timeline name' },
      });

      stateChanges.next({
        isSaving: true,
        timeline: { title: 'some timeline name' },
      });

      expect(spySetTitle.calls.allArgs()).toEqual([
        ['some timeline name'],
        ['*some timeline name'],
      ]);
    });

    it('should dispatch TIMELINE_CHANGED on form value changes', () => {
      spyOn(mockStore, 'dispatch');
      component.ngOnInit();
      stateChanges.next({
        timeline: {
          id: 'some id',
          title: 'some timelilne name',
        }
      });

      component.form.controls.title.setValue('some new title');

      expect(mockStore.dispatch).toHaveBeenCalledWith({
        type: 'TIMELINE_CHANGED',
        payload: {
          id: 'some id',
          title: 'some new title',
        }
      });
    });

    it('openTimelineEvent() should open modal with timeline event component', () => {
      const mockTimelineEventComponent = { event: null };
      spyOn(mockModalService, 'open').and.returnValue({ componentInstance: mockTimelineEventComponent });
      component.openTimelineEvent('some event title');
      expect(mockModalService.open).toHaveBeenCalledWith(EventComponent, { size: 'lg' });
      expect(mockTimelineEventComponent.event).toEqual({
        title: 'some event title',
        dateBegin: null,
        dateEnd: null,
      });
    });
  });

  describe('Shallow', () => {
    let component: TimelineComponent;
    let fixture: ComponentFixture<TimelineComponent>;

    beforeEach(async(() => {
      //noinspection JSIgnoredPromiseFromCall
      TestBed.configureTestingModule({
        imports: [RouterModule.forRoot([])],
        declarations: [TimelineComponent],
        providers: [
          FormBuilder,
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
            provide: NgbModal,
            useValue: {},
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
