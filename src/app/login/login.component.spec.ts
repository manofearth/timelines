import { async, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { LoginAction } from '../reducers/auth.reducer';
import { Store } from '@ngrx/store';

describe('LoginComponent', () => {

  describe('Isolated', () => {

    it('should dispatch LOGIN event on submit', () => {

      const mockStore: any = {
        dispatch: () => {
        }
      };
      spyOn(mockStore, 'dispatch');

      const component = new LoginComponent(new FormBuilder(), mockStore);
      component.ngOnInit();

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

  });

  describe('Shallow', () => {

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [LoginComponent],
        imports: [ReactiveFormsModule],
        providers: [
          FormBuilder,
          { provide: Store, useValue: {} },
        ]
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
