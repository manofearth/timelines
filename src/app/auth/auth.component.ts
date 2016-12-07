import { OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../reducers/index';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthState, AuthAction } from '../reducers/auth.reducer';
import { Subscription } from 'rxjs/Subscription';

export abstract class AuthComponent<TForm extends FormGroup, TAction extends AuthAction> implements OnInit, OnDestroy {

  form: TForm;
  error: Error;
  private appStateSubscription: Subscription;

  constructor(protected fb: FormBuilder,
              protected store: Store<AppState>,
              protected router: Router,
              protected changeDetector: ChangeDetectorRef,) {
  }

  ngOnInit() {
    this.form = this.createForm();

    this.appStateSubscription = this.store.select<AuthState>('auth').subscribe((auth: AuthState) => {
      this.error = auth.error;
      this.changeDetector.markForCheck();
      if (auth.user && !auth.error) {
        this.router.navigate(['/timelines']);
      }
    });

  }

  ngOnDestroy(): void {
    this.appStateSubscription.unsubscribe();
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.store.dispatch(this.createAction());
  }

  protected abstract createForm(): TForm;
  protected abstract createAction(): TAction;

}
