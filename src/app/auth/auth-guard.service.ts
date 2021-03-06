import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { AuthState } from './auth.reducer';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private store: Store<AppState>, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.store.select<AuthState>('auth')
      .filter((auth: AuthState): boolean => !auth.isLoading)
      .map((auth: AuthState) =>
        (auth.user !== null) && (auth.error === null)
      )
      .do((canActivate: boolean) => {
        if(!canActivate) {
          this.router.navigate(['/login']);
        }
      })
      .take(1);
  }

}