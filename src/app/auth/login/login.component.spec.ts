import { async, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { LoginAction, AuthState } from '../../reducers/auth.reducer';
import { Store } from '@ngrx/store';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LoginComponent', () => {

  describe('Isolated', () => {

    let mockStore: any;
    const fb = new FormBuilder();
    let component: LoginComponent;
    let mockRouter: any;
    let stateChanges: ReplaySubject<AuthState>;

    beforeEach(() => {

      stateChanges = new ReplaySubject<AuthState>();

      mockStore = {
        dispatch: () => {
        },
        select: () => stateChanges,
      };

      mockRouter = {
        navigate: () => {
        }
      };

      const mockChangeDetector: any = {
        markForCheck: () => {
        }
      };

      component = new LoginComponent(fb, mockStore, mockRouter, mockChangeDetector);
      component.ngOnInit();

    });

    it('should dispatch LOGIN event on submit', () => {

      spyOn(mockStore, 'dispatch');

      component.form.controls.email.setValue('test@test.ru');
      component.form.controls.password.setValue('some password');

      component.submit();

      const expectedAction: LoginAction = {
        type: 'ACTION_LOGIN',
        payload: {
          email: 'test@test.ru',
          password: 'some password',
        }
      };

      expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should not emit actions on submit if form not valid', () => {

      spyOn(mockStore, 'dispatch');

      component.form.setErrors({ someError: true });

      component.submit();

      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });

    it('should navigate to protected area if user authorized w/o error', () => {

      spyOn(mockRouter, 'navigate');

      stateChanges.next({ isLoading: false, error: null, user: null });
      stateChanges.next({ isLoading: false, error: <any>'some error', user: null });
      stateChanges.next({ isLoading: false, error: <any>'some error', user: <any>'some user' });
      expect(mockRouter.navigate).not.toHaveBeenCalled();

      stateChanges.next({ isLoading: false, error: null, user: <any>'some user' });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/timelines']);

    });

  });

  describe('Shallow', () => {

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
          LoginComponent,
        ],
        imports: [
          ReactiveFormsModule,
        ],
        providers: [
          FormBuilder,
          {
            provide: Store,
            useValue: {
              select: () => Observable.of({}),
            },
          },
          { provide: Router, useValue: {} },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .compileComponents();
    }));

    it('should create', () => {

      const fixture = TestBed.createComponent(LoginComponent);
      fixture.detectChanges();

      expect(fixture.componentInstance).toBeTruthy();
      expect(fixture.nativeElement.querySelector('#email')).not.toBeNull();
      expect(fixture.nativeElement.querySelector('#password')).not.toBeNull();
      expect(fixture.nativeElement.querySelector('#submit-button').innerText).toBe('Заполните все поля');
    });

  });

});
