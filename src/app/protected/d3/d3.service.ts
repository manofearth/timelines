import { Injectable } from '@angular/core';
import { select } from 'd3-selection';

@Injectable()
export class D3Service {
  select: typeof select = select;
}
