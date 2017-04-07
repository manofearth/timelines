//noinspection TypeScriptPreferShortImport
import { ReplaySubject, Observer } from '../../shared/rxjs';
import { EventComponent } from './event.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DateDirective } from '../date/date.directive';
import { DateParser } from '../shared/date-parser/date-parser.service';
import { Logger } from '../../shared/logger.service';
import { CommonModule } from '@angular/common';
import { Store, Action } from '@ngrx/store';
import { AppState } from '../../reducers';
import { TimelineEvent } from '../shared/timeline-event';
import { EventInsertAction, EventInsertAndAttachToTimelineAction, EventState } from './event.reducer';

describe('EventComponent', () => {

  let store: Store<AppState>;
  let stateChanges: ReplaySubject<AppState>;
  let mockDispatcher: Observer<Action>;

  beforeEach(() => {
    mockDispatcher = <any> {
      next: () => {
      },
    };
    stateChanges = new ReplaySubject<AppState>(1);
    store = new Store(mockDispatcher, null, stateChanges);
  });

  describe('Isolated', () => {
    const formBuilder: FormBuilder = new FormBuilder();
    let component: EventComponent;
    let mockModal: NgbActiveModal;


    beforeEach(() => {
      mockModal = <any> {
        close: () => {
        },
      };
      component = new EventComponent(formBuilder, mockModal, store);
    });

    beforeEach(() => {
      component.ngOnInit();
    });

    it('should init form', () => {

      expect(component.form).toBeUndefined();

      nextEventState({
        id: 'some-event-id',
        title: 'some event',
        dateBegin: { days: 0, title: '01.01.0001 до н.э.' },
        dateEnd: { days: 1, title: '01.01.0001 до н.э.' },
      });

      expect(component.form.value).toEqual({
        id: 'some-event-id',
        title: 'some event',
        dateBegin: { days: 0, title: '01.01.0001 до н.э.' },
        dateEnd: { days: 1, title: '01.01.0001 до н.э.' },
      });
    });

    it('should validate form', () => {

      nextEventState({
        id: null,
        title: '',
        dateBegin: null,
        dateEnd: null,
      });

      expect(component.form.invalid).toBe(true);
      expect(component.form.errors).toEqual({
        required: true,
      });
      expect(component.form.controls.title.errors).toEqual({ required: true });
      expect(component.form.controls.dateBegin.errors).toEqual({ required: true });
      expect(component.form.controls.dateEnd.errors).toEqual({ required: true });

      component.form.setValue({
        id: 'some-event-id',
        title: 'some title',
        dateBegin: { days: 0, title: '01.01.0001 до н.э.' },
        dateEnd: { days: 1, title: '01.01.0001 до н.э.' },
      });
      expect(component.form.invalid).toBe(false);
      expect(component.form.errors).toBeNull();

      component.form.controls.dateEnd.setValue({ days: -1, title: '30.12.0002 до н.э.' });
      expect(component.form.invalid).toBe(true);
      expect(component.form.errors).toEqual({ dateEndLessDateBegin: true });

    });

    describe('save()', () => {

      it('should switch to "save was attempted" mode', () => {
        nextEventState({
          id: null,
          title: null,
          dateBegin: null,
          dateEnd: null,
        });
        expect(component.saveWasAttempted).toBe(false);
        component.save();
        expect(component.saveWasAttempted).toBe(true);
      });

      describe('if not valid', () => {

        it('should not switch to "close after save" mode', () => {
          nextEventState({
            id: null,
            title: null,
            dateBegin: null,
            dateEnd: null,
          });
          expect(component.closeAfterSave).toBe(false);
          component.save();
          expect(component.closeAfterSave).toBe(false);
        });

        it('should not dispatch any actions', () => {

          spyOn(mockDispatcher, 'next');

          nextEventState({
            id: null,
            title: 'some event',
            dateBegin: null, // required
            dateEnd: null,   // required
          });

          component.save();

          expect(mockDispatcher.next).not.toHaveBeenCalled();
        });
      });

      describe('if valid', () => {

        it('should switch to "close after save" mode', () => {
          nextEventState({
            id: null,
            title: 'some event',
            dateBegin: { days: 0, title: '01.01.0001 до н.э.' },
            dateEnd: { days: 1, title: '01.01.0001 до н.э.' },
          });
          expect(component.closeAfterSave).toBe(false);
          component.save();
          expect(component.closeAfterSave).toBe(true);
        });

        describe('and if new', () => {

          beforeEach(() => {
            nextEventState({
              id: null, // new timeline event
              title: 'some event',
              dateBegin: { days: 0, title: '01.01.0001 до н.э.' },
              dateEnd: { days: 1, title: '01.01.0001 до н.э.' },
            });
          });

          it('should dispatch EVENT_INSERT action', () => {

            spyOn(mockDispatcher, 'next');

            component.save();

            expect(mockDispatcher.next).toHaveBeenCalledWith(<EventInsertAction>{
              type: 'EVENT_INSERT',
              payload: {
                id: null,
                title: 'some event',
                dateBegin: { days: 0, title: '01.01.0001 до н.э.' },
                dateEnd: { days: 1, title: '01.01.0001 до н.э.' },
              },
            });
          });

          it('should dispatch EVENT_INSERT_AND_ATTACH_TO_TIMELINE action', () => {

            spyOn(mockDispatcher, 'next');

            component.attachToTimeline = { id: 'some timeline uid' }; // important
            component.save();

            expect(mockDispatcher.next).toHaveBeenCalledWith(<EventInsertAndAttachToTimelineAction>{
              type: 'EVENT_INSERT_AND_ATTACH_TO_TIMELINE',
              payload: {
                timeline: { id: 'some timeline uid' },
                event: {
                  id: null,
                  title: 'some event',
                  dateBegin: { days: 0, title: '01.01.0001 до н.э.' },
                  dateEnd: { days: 1, title: '01.01.0001 до н.э.' },
                },
              },
            });
          });
        });

        describe('and if existent', () => {

          beforeEach(() => {
            nextEventState({
              id: 'some uid', // existent timeline event
              title: 'some event',
              dateBegin: { days: 0, title: '01.01.0001 до н.э.' },
              dateEnd: { days: 1, title: '01.01.0001 до н.э.' },
            });
          });

          it('should dispatch EVENT_UPDATE action', () => {

            spyOn(mockDispatcher, 'next');

            component.save();

            expect(mockDispatcher.next).toHaveBeenCalledWith({
              type: 'EVENT_UPDATE',
              payload: {
                id: 'some uid',
                title: 'some event',
                dateBegin: { days: 0, title: '01.01.0001 до н.э.' },
                dateEnd: { days: 1, title: '01.01.0001 до н.э.' },
              },
            });
          });
        });
      });
    });

    it('should close dialog in "close after save" mode when event changes state to "not saving"', () => {
      spyOn(mockModal, 'close');

      const event: TimelineEvent = {
        id: 'some-event-id',
        title: 'some event',
        dateBegin: { days: 0, title: '01.01.0001 до н.э.' },
        dateEnd: { days: 1, title: '01.01.0001 до н.э.' },
      };

      nextState({
        status: 'UPDATED',
        error: null,
        event: event,
      });

      expect(mockModal.close).not.toHaveBeenCalled();

      component.closeAfterSave = true;

      nextState({
        status: 'UPDATING',
        error: null,
        event: event,
      });

      nextState({
        status: 'UPDATED',
        error: null,
        event: event,
      });

      expect(mockModal.close).toHaveBeenCalledTimes(1);
      expect(mockModal.close).toHaveBeenCalledWith(event);
    });

    afterEach(() => {
      component.ngOnDestroy();
    });

  });

  describe('Shallow', () => {
    let component: EventComponent;
    let fixture: ComponentFixture<EventComponent>;

    beforeEach(async(() => {
      //noinspection JSIgnoredPromiseFromCall
      TestBed
        .configureTestingModule({
          imports: [
            CommonModule,
            ReactiveFormsModule,
          ],
          declarations: [
            EventComponent,
            DateDirective,
          ],
          providers: [
            FormBuilder,
            DateParser,
            Logger,
            {
              provide: NgbActiveModal,
              useValue: {},
            },
            {
              provide: Store,
              useValue: store,
            },
          ],
          schemas: [NO_ERRORS_SCHEMA],
        })
        .compileComponents();

    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(EventComponent);
      component = fixture.componentInstance;
    });

    it('should init and validate form', () => {

      nextEventState({
        id: 'some-event-id',
        title: 'some title',
        dateBegin: { days: 0, title: '01.01.0001 до н.э.' },
        dateEnd: { days: 1, title: '01.01.0001 до н.э.' },
      });
      fixture.detectChanges(); // fires ngOnInit()

      testFormInit();
      testFormValidate();

      component.ngOnDestroy();

    });

    //noinspection NestedFunctionJS
    function testFormInit() {

      const inputs = fixture.debugElement.queryAll(By.css('input[formControlName]'));
      expect(inputs.length).toBe(3);
      expect(inputs[0].attributes['formControlName']).toBe('title');
      expect(inputs[1].attributes['formControlName']).toBe('dateBegin');
      expect(inputs[2].attributes['formControlName']).toBe('dateEnd');
    }

    //noinspection NestedFunctionJS
    function testFormValidate() {

      const formGroups = fixture.debugElement.queryAll(By.css('.form-group'));
      expect(formGroups.length).toBe(3);
      expect(formGroups[0].classes['has-danger']).toBe(false);
      expect(formGroups[1].classes['has-danger']).toBe(false);
      expect(formGroups[2].classes['has-danger']).toBe(false);
      expect(formGroups[1].query(By.css('.form-control-feedback'))).toBeNull();

      component.form.setValue({
        id: null,
        title: '',       // required
        dateBegin: null, // required
        dateEnd: null,   // required
      });

      formGroups[0].query(By.css('input')).nativeElement.dispatchEvent(new Event('blur'));
      formGroups[1].query(By.css('input')).nativeElement.dispatchEvent(new Event('blur'));
      formGroups[2].query(By.css('input')).nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(formGroups[0].classes['has-danger']).toBe(true); // danger appearance
      expect(formGroups[1].classes['has-danger']).toBe(true); // danger appearance
      expect(formGroups[2].classes['has-danger']).toBe(true); // danger appearance
      expect(formGroups[1].query(By.css('.form-control-feedback'))).not.toBeNull(); // some danger notice
      expect(formGroups[2].query(By.css('.form-control-feedback'))).not.toBeNull(); // some danger notice

      component.form.setValue({
        id: 'some-event-id',
        title: 'some title',
        dateBegin: { days: 0, title: '01.01.0001 до н.э.' },
        dateEnd: { days: -1, title: '30.12.0002 до н.э.' }, // incorrect - less then beginning date
      });
      fixture.detectChanges();

      expect(formGroups[0].classes['has-danger']).toBe(false);
      expect(formGroups[1].classes['has-danger']).toBe(false);
      expect(formGroups[2].classes['has-danger']).toBe(true); // danger appearance
      expect(formGroups[1].query(By.css('.form-control-feedback'))).toBeNull();
      expect(formGroups[2].query(By.css('.form-control-feedback'))).not.toBeNull(); // some danger notice
    }

  });

  //noinspection NestedFunctionJS
  function nextState(state: EventState) {
    stateChanges.next({
      auth: null,
      timelines: null,
      timeline: null,
      event: state,
    });
  }

  //noinspection NestedFunctionJS
  function nextEventState(event: TimelineEvent) {
    nextState({
      status: 'UPDATED',
      error: null,
      event: event,
    });
  }
});
