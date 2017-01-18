import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoutComponent } from './logout.component';
import { AppState } from '../../reducers';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { LogoutAction, AuthState } from '../../auth/auth.reducer';
import { ReplaySubject, Observable } from '../../shared/rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;

  describe('Isolated', () => {

    let component: LogoutComponent;
    let store: Store<AppState>;
    let router: Router;
    let stateChanges: ReplaySubject<AuthState>;

    beforeEach(() => {

      stateChanges = new ReplaySubject<AuthState>();

      store = <any> {
        dispatch: () => {
        },
        select: () => stateChanges,
      };
      router = <any> {
        navigate: () => {
        },
      };

      component = new LogoutComponent(store, router);
    });

    it('ngOnInit() should navigate to /login if user not logged in', () => {

      stateChanges.next({
        user: null,
        error: null,
        isLoading: false,
      });

      spyOn(router, 'navigate');
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('logout() should dispatch LOGOUT', () => {
      spyOn(store, 'dispatch');
      component.logout();
      expect(store.dispatch).toHaveBeenCalledWith(<LogoutAction>{
        type: 'LOGOUT',
      });
    });

  });

  describe('Shallow', () => {

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [LogoutComponent],
        providers: [
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

    beforeEach(() => {
      fixture = TestBed.createComponent(LogoutComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });


});
