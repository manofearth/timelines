import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers/index';
import { AuthState } from '../reducers/auth.reducer';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private store: Store<AppState>, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.store.select('auth')
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