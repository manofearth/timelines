import { AuthGuard } from './auth-guard.service';
import { ReplaySubject } from 'rxjs';
import { AuthState } from '../reducers/auth.reducer';
import { Router } from '@angular/router';


describe('AuthGuard', () => {

  let guard: AuthGuard;
  let mockStateChanges: ReplaySubject<AuthState>;
  let mockRouter: Router;

  beforeEach(() => {

    mockStateChanges = new ReplaySubject<AuthState>();
    mockRouter = <any>{
      navigate: () => {}
    };
    spyOn(mockRouter, 'navigate');

    const mockStore: any = {
      select: () => mockStateChanges,
    };

    guard = new AuthGuard(mockStore, mockRouter);
  });

  it('should return true if user authenticated with no error', done => {

    mockStateChanges.next({
      user: <any>'firebase auth state',
      error: null,
    });

    guard.canActivate(null, null).subscribe((canActivate: boolean) => {
      expect(canActivate).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should return false and navigate to login page if user not authenticated', done => {

    mockStateChanges.next({
      user: null,
      error: null,
    });

    guard.canActivate(null, null).subscribe((canActivate: boolean) => {
      expect(canActivate).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });

  });

  it('should return false and navigate to login page on authentication error', done => {

    mockStateChanges.next({
      user: null,
      error: <any>'some error',
    });

    guard.canActivate(null, null).subscribe((canActivate: boolean) => {
      expect(canActivate).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });

  });

});
