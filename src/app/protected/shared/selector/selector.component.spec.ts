import { SelectorComponent } from './selector.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SelectorComponent', () => {

  describe('Isolated', () => {
    let component: SelectorComponent;

    beforeEach(() => {
      component = new SelectorComponent();
      component.ngOnInit();
    });

    describe('emitCreateEvent()', () => {

      it('should emit "create" event', () => {

        let subscriberSpy: jasmine.Spy = jasmine.createSpy('subscriber');

        component.create.subscribe(subscriberSpy);

        component.inputControl.setValue('some user input');

        component.emitCreateEvent();

        expect(subscriberSpy).toHaveBeenCalledWith('some user input');

      });
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
