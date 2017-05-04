import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

@Injectable()
export class WindowService {

  resize$: Observable<Event> = Observable.fromEvent(window, 'resize');

}
