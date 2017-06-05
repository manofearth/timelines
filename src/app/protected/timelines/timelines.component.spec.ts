import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TimelinesComponent } from './timelines.component';
import { Observable } from '../../shared/rxjs';
import { Store } from '@ngrx/store';
import { RouterModule, Router } from '@angular/router';
import { AppState } from '../../reducers';
import { TimelinesGetAction, TimelinesState, TimelineCreateAction, TimelineDeleteAction } from './timelines.reducer';
import { APP_BASE_HREF } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';

describe('TimelinesComponent', () => {

  describe('Isolated', () => {

    let mockStore: Store<AppState>;
    let component: TimelinesComponent;
    let mockRouter: Router;
    let mockBootstrapModal: NgbModal;

    beforeEach(() => {
      mockStore = <any>{
        dispatch: () => {
        },
        select: () => Observable.of({}),
      };
      mockRouter = <any>{
        navigate: () => {
        },
      };
      mockBootstrapModal = <any>{
        open: () => ({
          result: {
            then: () => {
            },
          },
        }),
      };

      const mockChangeDetector: ChangeDetectorRef = <any>{
        markForCheck: () => {
        }
      };

      const mockTitleService: Title = <any>{
        setTitle: () => { },
      };

      component = new TimelinesComponent(
        mockStore,
        mockRouter,
        mockChangeDetector,
        mockBootstrapModal,
        mockTitleService
      );
    });

    it('ngOnInit() should dispatch TIMELINES_GET', () => {
      spyOn(mockStore, 'dispatch');
      component.ngOnInit();
      expect(mockStore.dispatch).toHaveBeenCalledWith(<TimelinesGetAction>{
        type: 'TIMELINES_GET',
      });
    });

    it('create() should dispatch TIMELINE_CREATE and set "open new" mode', () => {
      spyOn(mockStore, 'dispatch');
      component.create();
      expect(mockStore.dispatch).toHaveBeenCalledWith(<TimelineCreateAction>{
        type: 'TIMELINE_CREATE',
      });
      expect(component.modeOpenNew).toBe(true);
    });

    it('should navigate to new timeline when it ID acquired in "open new" mode', () => {
      spyOn(mockRouter, 'navigate');
      mockStore.select = () => Observable.of({
        newTimelineId: 'new-timeline-id',
      });
      component.modeOpenNew = true;
      component.ngOnInit();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/timeline/new-timeline-id']);
    });

    it('confirmDeletion() should open modal', () => {
      spyOn(mockBootstrapModal, 'open').and.callThrough();
      component.confirmDeletion(<any>'some timeline');
      expect(mockBootstrapModal.open).toHaveBeenCalled();
    });

    it('confirmDeletion() should not dispatch TIMELINE_DELETE if user not confirmed it', fakeAsync(() => {
      spyOn(mockStore, 'dispatch');
      mockBootstrapModal.open = <any>(() => ({ result: Promise.resolve(false) }));
      component.confirmDeletion(<any>'some timeline');
      tick();
      expect(mockStore.dispatch).not.toHaveBeenCalled();
    }));

    it('confirmDeletion() should dispatch TIMELINE_DELETE if user confirmed it', fakeAsync(() => {
      spyOn(mockStore, 'dispatch');
      mockBootstrapModal.open = <any>(() => ({ result: Promise.resolve(true) }));
      component.confirmDeletion(<any>'some timeline');
      tick();
      expect(mockStore.dispatch).toHaveBeenCalledWith(<TimelineDeleteAction>{
        type: 'TIMELINE_DELETE',
        payload: <any>'some timeline',
      });
    }));
  });

  describe('Shallow', () => {
    let component: TimelinesComponent;
    let fixture: ComponentFixture<TimelinesComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [RouterModule.forRoot([])],
        declarations: [TimelinesComponent],
        providers: [
          {
            provide: Store,
            useValue: {
              select: () => Observable.of(<TimelinesState>{
                isLoading: true,
                error: new Error('some error'),
                newTimelineId: null,
                timelines: [
                  { title: 'Timeline 1' },
                  { title: 'Timeline 2' },
                ],
              }),
              dispatch: () => {
              },
            },
          },
          {
            provide: APP_BASE_HREF,
            useValue: '/',
          },
          {
            provide: NgbModal,
            useValue: {},
          }
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
      expect(fixture.nativeElement.textContent).toContain('some error');
      expect(fixture.nativeElement.textContent).toContain('загружаются...');
      const rows: HTMLTableRowElement[] = fixture.nativeElement.querySelectorAll('tr');
      expect(rows[0].textContent).toContain('Timeline 1');
      expect(rows[1].textContent).toContain('Timeline 2');
    });

  });
});
