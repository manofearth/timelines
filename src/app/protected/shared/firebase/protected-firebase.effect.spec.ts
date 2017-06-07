import { ProtectedFirebaseEffect } from './protected-firebase.effect';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { EffectsRunner } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { AuthFirebaseServiceStub } from './auth-firebase.service.stub';
import { fakeAsync, flushMicrotasks } from '@angular/core/testing';
import createSpy = jasmine.createSpy;

class ProtectedFirebaseEffectStub extends ProtectedFirebaseEffect<any, any, any, any, any, any> {

  effectRunner: (action: any) => Observable<any>;
  successActionMapper: (val: any) => any = (val) => val;
  interestedActionType: string;
  errorActionType: string;
  actionsObservableModifier: (val: Observable<any>) => Observable<any> = (val) => val;

  protected runEffect(action: any): Observable<any> {
    return this.effectRunner(action);
  }

  protected modifyActionsObservable(actions: Observable<any>): Observable<any> {
    return this.actionsObservableModifier(actions);
  }

  protected mapToSuccessAction(effectResult: any) {
    return this.successActionMapper(effectResult);
  }

  protected getInterestedActionType() {
    return this.interestedActionType;
  }

  protected getErrorActionType() {
    return this.errorActionType;
  }
}

describe('ProtectedFirebaseEffect', () => {

  let effectUnderTest: ProtectedFirebaseEffectStub;
  let actions: EffectsRunner;
  let auth: AuthFirebaseServiceStub;

  beforeEach(() => {
    actions = new EffectsRunner();
    auth = new AuthFirebaseServiceStub();
    effectUnderTest = new ProtectedFirebaseEffectStub(new Actions(actions), auth);
    effectUnderTest.interestedActionType = 'some-interesting-action-type';
  });

  describe('when user not logged in', () => {
    it('should not react on actions if user not logged in', () => {

      effectUnderTest.effectRunner = createSpy('effectRunner').and.returnValue(Observable.of('some-effect-result'));

      actions.queue({ type: 'some-interesting-action-type' });

      effectUnderTest.effect.subscribe(() => {
        fail('should be silent, because user is not logged in');
      });

      expect(effectUnderTest.effectRunner).not.toHaveBeenCalled();
    });
  });

  describe('when user logged in', () => {

    beforeEach(() => {
      auth.logIn('some-user-uid');
    });

    it('should run effect only on actions of interested type', fakeAsync(() => {

      effectUnderTest.effectRunner = createSpy('effectRunner').and.returnValue(Observable.of('some-effect-result'));

      actions.queue({ type: 'some-interesting-action-type' });
      actions.queue({ type: 'some-not-interesting-action-type' });

      effectUnderTest.effect.subscribe((result) => {
        expect(result).toBe('some-effect-result');
      });
      flushMicrotasks(); // or tick() ?

      expect(effectUnderTest.effectRunner).toHaveBeenCalledTimes(1); // second action was not interesting
    }));

    it('should map to success action', (done: DoneFn) => {
      effectUnderTest.effectRunner = () => Observable.of('some-effect-result');
      effectUnderTest.successActionMapper = (effectResult) => effectResult + '-mapped';

      actions.queue({ type: 'some-interesting-action-type' });

      effectUnderTest.effect.subscribe((result) => {
        expect(result).toBe('some-effect-result-mapped');
        done();
      });

    });

    it('should map to error action', (done: DoneFn) => {

      effectUnderTest.effectRunner = () => Observable.throw('some-error');
      effectUnderTest.errorActionType = 'some-error-action-type';

      actions.queue({ type: 'some-interesting-action-type' });

      effectUnderTest.effect.subscribe((result) => {
        expect(result).toEqual({
          type: 'some-error-action-type',
          payload: new Error('some-error')
        });
        done();
      });
    });

    it('should modify actions observable', (done: DoneFn) => {

      effectUnderTest.effectRunner = createSpy('effectRunner').and.returnValue(Observable.of('some-effect-result'));
      effectUnderTest.interestedActionType = 'some-interesting-action-type'; // original action
      effectUnderTest.actionsObservableModifier = (o: Observable<any>) => {
        return o.map((action) => ({
          type: action.type + '-mapped' // modifying action
        }));
      };

      actions.queue({ type: 'some-interesting-action-type' });

      effectUnderTest.effect.subscribe(() => {
        expect(effectUnderTest.effectRunner).toHaveBeenCalledWith({
          type: 'some-action-type-mapped' // modifier works
        });
        done();
      });
    });

  });


});
