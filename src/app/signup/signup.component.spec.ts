import { Store } from '@ngrx/store';
import { SignupAction } from '../reducers';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';

describe('SignupComponent', () => {

  describe('Isolated', () => {

    let mockStore: any;
    const fb = new FormBuilder();
    let component: SignupComponent;

    beforeEach(() => {
      mockStore = {
        dispatch: () => { }
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
    let component: SignupComponent;
    let fixture: ComponentFixture<SignupComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [SignupComponent],
        imports: [ReactiveFormsModule],
        providers: [
          FormBuilder,
          { provide: Store, useValue: {} }
        ]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(SignupComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
      expect(fixture.nativeElement.querySelector('form input[formGroupName=email]')).not.toBeNull();
      expect(fixture.nativeElement.querySelector('form input[formGroupName=password]')).not.toBeNull();
      expect(fixture.nativeElement.querySelector('form input[formGroupName=passwordAgain]')).not.toBeNull();
      expect(fixture.nativeElement.querySelector('#submit-button').innerText).toBe('Заполните все поля');
    });
  });
});
