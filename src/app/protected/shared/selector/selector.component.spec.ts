import { SelectorComponent, KEY_ENTER } from './selector.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SelectorComponent', () => {

  describe('Isolated', () => {
    let component: SelectorComponent;

    beforeEach(() => {
      component = new SelectorComponent();
      component.ngOnInit();
    });

    it('should emit "create" event if user press "enter" key or "create" button', () => {

      let subscriberSpy: jasmine.Spy = jasmine.createSpy('subscriber');

      component.create.subscribe(subscriberSpy);

      component.inputControl.setValue('some user input');

      component.onKeyDown(KEY_ENTER);
      component.onKeyDown(1); // some not "enter" key pressed, should not emit event
      component.onCreateButtonClick();

      expect(subscriberSpy.calls.count()).toBe(2);
      expect(subscriberSpy.calls.allArgs()).toEqual([
        ['some user input'],
        ['some user input'],
      ]);
    });
  });

  describe('Shallow', () => {
    let component: SelectorComponent;
    let fixture: ComponentFixture<SelectorComponent>;

    beforeEach(async(() => {
      //noinspection JSIgnoredPromiseFromCall
      TestBed.configureTestingModule({
        declarations: [SelectorComponent],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(SelectorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});