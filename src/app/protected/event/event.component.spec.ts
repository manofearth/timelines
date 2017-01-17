import { EventComponent } from './event.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DateDirective } from '../date/date.directive';
import { DateParser } from '../shared/date-parser/date-parser.service';
import { Logger } from '../../shared/logger.service';
import { dispatchEvent } from '@angular/platform-browser/testing/browser_util';
import { CommonModule } from '@angular/common';

describe('EventComponent', () => {

  describe('Isolated', () => {
    const formBuilder: FormBuilder = new FormBuilder();
    let component: EventComponent;

    beforeEach(() => {

      const modal: NgbActiveModal = <any> {};

      component = new EventComponent(formBuilder, modal);
    });

    it('ngOnInit() should init form', () => {

      component.event = {
        title: 'some event',
        dateBegin: { day: 0, title: '01.01.0001 до н.э.' },
        dateEnd: { day: 1, title: '01.01.0001 до н.э.' },
      };
      expect(component.form).toBeUndefined();
      component.ngOnInit();
      expect(component.form.value).toEqual({
        title: 'some event',
        dateBegin: { day: 0, title: '01.01.0001 до н.э.' },
        dateEnd: { day: 1, title: '01.01.0001 до н.э.' },
      });
    });

    it('should validate form', () => {

      component.event = {
        title: '',
        dateBegin: null,
        dateEnd: null,
      };

      component.ngOnInit();

      expect(component.form.invalid).toBe(true);
      expect(component.form.errors).toEqual({
        required: true,
      });
      expect(component.form.controls.title.errors).toEqual({ required: true });
      expect(component.form.controls.dateBegin.errors).toEqual({ required: true });
      expect(component.form.controls.dateEnd.errors).toEqual({ required: true });

      component.form.setValue({
        title: 'some title',
        dateBegin: { day: 0, title: '01.01.0001 до н.э.' },
        dateEnd: { day: 1, title: '01.01.0001 до н.э.' },
      });
      expect(component.form.invalid).toBe(false);
      expect(component.form.errors).toBeNull();

      component.form.controls.dateEnd.setValue({ day: -1, title: '30.12.0002 до н.э.' });
      expect(component.form.invalid).toBe(true);
      expect(component.form.errors).toEqual({ dateEndLessDateBegin: true });

    });
  });

  describe('Shallow', () => {
    let component: EventComponent;
    let fixture: ComponentFixture<EventComponent>;

    beforeEach(async(() => {
      //noinspection JSIgnoredPromiseFromCall
      TestBed.configureTestingModule({
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

      testFormInit();
      testFormValidate();

    });

    //noinspection NestedFunctionJS
    function testFormInit() {
      component.event = {
        title: 'some title',
        dateBegin: { day: 0, title: '01.01.0001 до н.э.' },
        dateEnd: { day: 1, title: '01.01.0001 до н.э.' },
      };
      fixture.detectChanges();

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
        title: '',       // required
        dateBegin: null, // required
        dateEnd: null,   // required
      });
      dispatchEvent(formGroups[0].query(By.css('input')).nativeElement, 'blur'); // touch
      dispatchEvent(formGroups[1].query(By.css('input')).nativeElement, 'blur'); // touch
      dispatchEvent(formGroups[2].query(By.css('input')).nativeElement, 'blur'); // touch
      fixture.detectChanges();

      expect(formGroups[0].classes['has-danger']).toBe(true); // danger appearance
      expect(formGroups[1].classes['has-danger']).toBe(true); // danger appearance
      expect(formGroups[2].classes['has-danger']).toBe(true); // danger appearance
      expect(formGroups[1].query(By.css('.form-control-feedback'))).not.toBeNull(); // some danger notice
      expect(formGroups[2].query(By.css('.form-control-feedback'))).not.toBeNull(); // some danger notice

      component.form.setValue({
        title: 'some title',
        dateBegin: { day: 0, title: '01.01.0001 до н.э.' },
        dateEnd: { day: -1, title: '30.12.0002 до н.э.' }, // incorrect - less then beginning date
      });
      fixture.detectChanges();

      expect(formGroups[0].classes['has-danger']).toBe(false);
      expect(formGroups[1].classes['has-danger']).toBe(false);
      expect(formGroups[2].classes['has-danger']).toBe(true); // danger appearance
      expect(formGroups[1].query(By.css('.form-control-feedback'))).toBeNull();
      expect(formGroups[2].query(By.css('.form-control-feedback'))).not.toBeNull(); // some danger notice
    }

  });
});
