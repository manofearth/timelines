import { Observable, Subject, Observer } from '../../shared/rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineComponent } from './timeline.component';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { TimelineState, TimelineGetAction } from './timeline.reducer';
import { AppState } from '../../reducers';
import { Title } from '@angular/platform-browser';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventComponent } from '../event/event.component';

describe('TimelineComponent', () => {

  describe('Isolated', () => {
    let stateChanges = new Subject();
    let component: TimelineComponent;
    let mockStore: Store<AppState>;
    let mockRoute: ActivatedRoute;
    let mockTitleService: Title;
    let mockModalService: NgbModal;
    let mockDispatcher: Observer<Action>;
    let mockModalRef: NgbModalRef;

    beforeEach(() => {
      stateChanges = new Subject<AppState>();
      mockDispatcher = <any> {
        next: () => {
        },
      };
      mockStore = new Store(mockDispatcher, <any> {}, stateChanges);
      mockRoute = <any>{
        params: Observable.of({}),
      };
      mockTitleService = <any>{
        setTitle: () => {
        },
      };
      mockModalRef = <any> {
        close: () => {
        },
        result: Promise.resolve(),
        componentInstance: {},
      };
      mockModalService = <any>{
        open: () => mockModalRef,
      };
      const mockChangeDetector: ChangeDetectorRef = <any>{
        markForCheck: () => {
        },
      };
      const formBuilder: FormBuilder = new FormBuilder();

      component = new TimelineComponent(
        mockStore, mockRoute, formBuilder, mockChangeDetector, mockTitleService, mockModalService);
    });

    describe('createAndOpenTimelineEvent()', () => {
      it('should dispatch EVENT_CREATE action', () => {
        spyOn(mockStore, 'dispatch');
        component.createAndOpenTimelineEvent('some event title');
        expect(mockStore.dispatch).toHaveBeenCalledWith({
          type: 'EVENT_CREATE',
          payload: 'some event title',
        });
      });
      it('should open modal', () => {
        spyOn(mockModalService, 'open').and.callThrough();
        component.timeline = <any> 'timeline stub';
        component.createAndOpenTimelineEvent('some event title');
        expect(mockModalService.open).toHaveBeenCalledWith(EventComponent, { size: 'lg' });
        expect(mockModalRef.componentInstance.attachToTimeline).toBe('timeline stub');
      });
    });

    describe('openTimelineEvent()', () => {
      it('should dispatch EVENT_GET action', () => {
        spyOn(mockStore, 'dispatch');
        component.openTimelineEvent('some-event-id');
        expect(mockStore.dispatch).toHaveBeenCalledWith({
          type: 'EVENT_GET',
          payload: 'some-event-id',
        });
      });
      it('should open modal', () => {
        spyOn(mockModalService, 'open');
        component.timeline = <any> 'timeline stub';
        component.openTimelineEvent('some-event-id');
        expect(mockModalService.open).toHaveBeenCalledWith(EventComponent, { size: 'lg' });
      });
    });

    it('should dispatch TIMELINE_GET on init', () => {
      spyOn(mockStore, 'dispatch');
      mockRoute.params = Observable.of({ id: 'some id' });
      component.ngOnInit();
      expect(mockStore.dispatch).toHaveBeenCalledWith(<TimelineGetAction>{
        type: 'TIMELINE_GET',
        payload: 'some id',
      });
    });

    describe('after init', () => {
      beforeEach(() => {
        component.ngOnInit();
      });

      it('should display "saving" state at window title', () => {
        const spySetTitle: jasmine.Spy = spyOn(mockTitleService, 'setTitle');

        stateChanges.next({
          event: { event: {} },
          timeline: {
            timeline: { title: 'some timeline name' },
          },
        });

        stateChanges.next({
          event: { event: {} },
          timeline: {
            isSaving: true,
            timeline: { title: 'some timeline name' },
          },
        });

        expect(spySetTitle.calls.allArgs()).toEqual([
          ['some timeline name'],
          ['*some timeline name'],
        ]);
      });

      it('should dispatch TIMELINE_CHANGED on form value changes', () => {
        spyOn(mockStore, 'dispatch');

        stateChanges.next({
          event: { event: {} },
          timeline: {
            timeline: {
              id: 'some id',
              title: 'some timelilne name',
            }
          },
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

      afterEach(() => {
        component.ngOnDestroy();
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
            useValue: {
              open: () => ({
                result: Promise.resolve(),
              })
            },
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

    afterEach(() => {
      component.ngOnDestroy();
    });
  });
});
