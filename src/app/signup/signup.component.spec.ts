import { Store } from '@ngrx/store';
import { SignupAction, AuthState } from '../reducers/auth.reducer';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { async, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';

describe('SignupComponent', () => {

  describe('Isolated', () => {

    let mockStore: any;
    const fb = new FormBuilder();
    let component: SignupComponent;
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

      // noinspection JSUnusedGlobalSymbols
      const mockChangeDetector: any = {
        markForCheck: () => {
        }
      };

      component = new SignupComponent(fb, mockStore, mockRouter, mockChangeDetector);
      component.ngOnInit();

    });

    it('should emit SIGNUP action on submit', () => {

      spyOn(mockStore, 'dispatch');

      component.form.controls.email.setValue('test@mail.ru');
      component.form.controls.password.setValue('some password');
      component.form.controls.passwordAgain.setValue('some password');

      component.submit();

      const expectedAction: SignupAction = {
        type: 'ACTION_SIGNUP',
        payload: {
          email: 'test@mail.ru',
          password: 'some password',
          passwordAgain: 'some password'
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

    it('should compose tooltip title', () => {

      expect(component.submitButtonTitle).toBe('Заполните все поля');

      component.form.controls.email.setValue('test');
      expect(component.submitButtonTitle).toBe('Введите правильный email');

      component.form.controls.email.setValue('test@test.tt');
      expect(component.submitButtonTitle).toBe('Заполните все поля');

      component.form.controls.password.setValue('1');
      expect(component.submitButtonTitle).toBe('Введите пароль от 6 символов');

      component.form.controls.password.setValue('123456');
      expect(component.submitButtonTitle).toBe('Заполните все поля');

      component.form.controls.passwordAgain.setValue('1');
      expect(component.submitButtonTitle).toBe('Пароли не совпадают');

      component.form.controls.passwordAgain.setValue('123456');
      expect(component.submitButtonTitle).toBe('Зарегистрироваться');
    });

    it('should navigate to protected area if user authorized w/o error', () => {

      spyOn(mockRouter, 'navigate');

      stateChanges.next({ error: null, user: null });
      stateChanges.next({ error: <any>'some error', user: null });
      stateChanges.next({ error: <any>'some error', user: <any>'some user' });
      expect(mockRouter.navigate).not.toHaveBeenCalled();

      stateChanges.next({ error: null, user: <any>'some user' });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/timelines']);

    });

  });


  describe('Shallow', () => {

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [SignupComponent],
        imports: [ReactiveFormsModule],
        providers: [
          FormBuilder,
          {
            provide: Store,
            useValue: {
              select: () => ({
                subscribe: () => {
                },
              }),
            },
          }, {
            provide: Router,
            useValue: {},
          }
        ],
      })
        .compileComponents();
    }));

    it('should create', () => {

      const fixture = TestBed.createComponent(SignupComponent);
      fixture.detectChanges();

      expect(fixture.componentInstance).toBeTruthy();
      expect(fixture.nativeElement.querySelector('#email')).not.toBeNull();
      expect(fixture.nativeElement.querySelector('#password')).not.toBeNull();
      expect(fixture.nativeElement.querySelector('#password-again')).not.toBeNull();
      expect(fixture.nativeElement.querySelector('#submit-button').innerText).toBe('Заполните все поля');
    });
  });
});
