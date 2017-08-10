import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { AppState } from '../../../reducers';
import { Action, Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

@Directive({
  selector: 'input[tlInput]'
})
export class InputDirective implements OnInit, OnDestroy {

  @Input('tlInput') name: string;
  @Input() stateMapFn: (state: AppState) => string;

  private stateSub: Subscription;

  constructor(
    private store: Store<AppState>,
    private renderer: Renderer2,
    private el: ElementRef,
  ) { }

  ngOnInit() {
    this.stateSub = this.store.select<string>(this.stateMapFn).subscribe(state => {
      this.renderer.setProperty(this.el.nativeElement, 'value', state);
    });
  }

  ngOnDestroy() {
    this.stateSub.unsubscribe();
  }

  //noinspection JSUnusedGlobalSymbols
  @HostListener('change', ['$event.target.value'])
  onChange(value: string) {
    const action: InputChangedAction = {
      type: 'INPUT_CHANGED',
      payload: {
        name: this.name,
        value: value,
      }
    };
    this.store.dispatch(action);
  }
}

export interface InputChangedAction extends Action {
  type: 'INPUT_CHANGED';
  payload: {
    name: string;
    value: string;
  }
}
