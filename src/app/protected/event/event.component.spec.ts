import { EventComponent } from './event.component';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

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
  });

  describe('Shallow', () => {
    let component: EventComponent;
    let fixture: ComponentFixture<EventComponent>;

    beforeEach(async(() => {
      //noinspection JSIgnoredPromiseFromCall
      TestBed.configureTestingModule({
        declarations: [EventComponent],
        providers: [
          FormBuilder,
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
      component.event = {
        title: 'some event',
        dateBegin: { day: 0, title: '01.01.0001 до н.э.' },
        dateEnd: { day: 1, title: '01.01.0001 до н.э.' },
      };
      fixture.detectChanges();
    });

    it('should init form', () => {
      const inputs = fixture.debugElement.queryAll(By.css('input[formControlName]'));
      expect(inputs.length).toBe(3);
      expect(inputs[0].attributes['formControlName']).toBe('title');
      expect(inputs[1].attributes['formControlName']).toBe('dateBegin');
      expect(inputs[2].attributes['formControlName']).toBe('dateEnd');
    });
  });
});