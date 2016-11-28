import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { FormBuilder } from '@angular/forms';
import { LoginAction } from '../reducers';
import { Store } from '@ngrx/store';

describe('LoginComponent', () => {

  describe('Isolated', () => {

    it('should dispatch LOGIN event on submit', () => {

      const mockStore: any = {
        next: () => { }
      };
      spyOn(mockStore, 'next');

      const component = new LoginComponent(new FormBuilder(), mockStore);
      component.ngOnInit();

      component.form.controls.email.setValue('test@test.ru');
      component.form.controls.password.setValue('abcd');

      component.submit();

      const expectedAction: LoginAction = {
        type: 'ACTION_LOGIN',
        payload: {
          email: 'test@test.ru',
          password: 'abcd',
        }
      };

      expect(mockStore.next).toHaveBeenCalledWith(expectedAction);
    });

  });

  describe('Shallow', () => {

    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [LoginComponent],
        providers: [
          FormBuilder,
          { provide: Store, useValue: {} },
        ]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

  });

});
