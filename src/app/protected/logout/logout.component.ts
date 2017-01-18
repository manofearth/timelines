import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { AuthState, LogoutAction, User } from '../../auth/auth.reducer';
import { AppState } from '../../reducers';
import { Router } from '@angular/router';

@Component({
  selector: 'tl-logout',
  template: `<span class="logged-in-user">{{user?.email}}</span><a href="javascript:void(0)" (click)="logout()">Выйти</a>`,
  styleUrls: ['./logout.component.css'],
})
export class LogoutComponent implements OnInit, OnDestroy {

  user: User;
  private auth: Observable<AuthState>;
  private authSubscription: Subscription;

  constructor(private store: Store<AppState>, private router: Router) {
  }

  ngOnInit(): void {
    this.authSubscription = this.store.select<AuthState>('auth').subscribe((auth: AuthState) => {
      this.user = auth.user;
      if (this.user === null) {
        //noinspection JSIgnoredPromiseFromCall
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  logout() {
    this.store.dispatch(<LogoutAction>{
      type: 'LOGOUT',
    });
  }

}
