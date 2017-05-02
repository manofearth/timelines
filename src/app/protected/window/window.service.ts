import { Injectable } from '@angular/core';
import { toInt } from '../../shared/helpers';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

@Injectable()
export class WindowService {

  resize$: Observable<Event> = Observable.fromEvent(window, 'resize');

  //noinspection JSMethodCanBeStatic
  getComputedWidth(el: Element): string {
    return window.getComputedStyle(el).width;
  }

  //noinspection JSMethodCanBeStatic
  getComputedHeight(el: Element): string {
    return window.getComputedStyle(el).height;
  }

  getComputedWidthAsInt(el: Element): number {
    return toInt(this.getComputedWidth(el));
  }

  getComputedHeightAsInt(el: Element): number {
    return toInt(this.getComputedHeight(el));
  }

}
