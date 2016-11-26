import { Store } from '@ngrx/store';
import { LoginAction } from '../reducers';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {

  describe('Isolated', () => {

    let mockStore: any;
    const fb = new FormBuilder();
    let component: LoginComponent;

    beforeEach(() => {
      mockStore = {
        dispatch: () => { }
      }

      component = new LoginComponent(fb, mockStore);
      component.ngOnInit();

    });

    it('should emit LOGIN action on submit', () => {

      spyOn(mockStore, 'dispatch');

      component.form.controls.email.setValue('test@mail.ru');
      component.form.controls.password.setValue('some password');
      component.form.controls.passwordAgain.setValue('some password');

      component.submit();

      const expectedAction: LoginAction = {
        type: 'ACTION_LOGIN',
        payload: {
          email: 'test@mail.ru',
          password: 'some password',
          passwordAgain: 'some password'
        }
      }

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
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [LoginComponent],
        imports: [ReactiveFormsModule],
        providers: [
          FormBuilder,
          { provide: Store, useValue: {} }
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
      expect(fixture.nativeElement.querySelector('form input[formGroupName=email]')).not.toBeNull();
      expect(fixture.nativeElement.querySelector('form input[formGroupName=password]')).not.toBeNull();
      expect(fixture.nativeElement.querySelector('form input[formGroupName=passwordAgain]')).not.toBeNull();
      expect(fixture.nativeElement.querySelector('#submit-button').innerText).toBe('Заполните все поля');
    });
  });
});
