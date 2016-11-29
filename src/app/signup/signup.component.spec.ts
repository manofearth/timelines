import { Store } from '@ngrx/store';
import { SignupAction } from '../reducers';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { async, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';

describe('SignupComponent', () => {

  describe('Isolated', () => {

    let mockStore: any;
    const fb = new FormBuilder();
    let component: SignupComponent;

    beforeEach(() => {
      mockStore = {
        dispatch: () => {
        },
        select: () => ({
          subscribe: () => {
          },
        }),
      };

      component = new SignupComponent(fb, mockStore);
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
          },
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
