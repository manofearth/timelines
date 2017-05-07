import { Injectable } from '@angular/core';
import { Selection, select, event } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { axisBottom } from 'd3-axis';

@Injectable()
export class D3Service {

  select: typeof select = select;

  scaleLinear: typeof scaleLinear = scaleLinear;

  axisBottom: typeof axisBottom = axisBottom;

  //noinspection JSMethodCanBeStatic
  get event(): typeof event {
    return event;
  }

  selectEventTarget(): Selection<Element, any, Element, any> {
    return this.select(this.event.target);
  }
}
