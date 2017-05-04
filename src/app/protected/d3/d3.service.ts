import { Injectable } from '@angular/core';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';

@Injectable()
export class D3Service {
  select: typeof select = select;
  scaleLinear: typeof scaleLinear = scaleLinear;
}
