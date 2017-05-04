import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { D3Service } from '../d3/d3.service';
import { WindowService } from '../window/window.service';
import { Selection } from 'd3-selection';
import { Subscription } from 'rxjs/Subscription';
import { TimelineEventForTimeline } from '../timeline/timeline.reducer';

@Component({
  selector: 'tl-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ChartComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('container') container: ElementRef;
  @ViewChild('svg') svg: ElementRef;

  private windowResizeSubscription: Subscription;
  private _data: TimelineEventForTimeline[];
  private canvasHeight = 170;

  constructor(
    private d3: D3Service,
    private window: WindowService,
  ) {
  }

  ngOnInit(): void {

    this.redraw();

    this.windowResizeSubscription = this.window.resize$.subscribe(() => {
      this.redraw();
    });
  }

  ngOnDestroy(): void {
    this.windowResizeSubscription.unsubscribe();
  }

  ngAfterViewChecked(): void {
    this.redraw();
  }

  get width(): number {
    return this.container.nativeElement.clientWidth - 5;
  }

  get height(): number {
    return this.canvasHeight;
  }

  @Input('data')
  set data(data: TimelineEventForTimeline[]) {
    this._data = data;
    this.redraw();
  }

  private selectSvg(): Selection<Element, any, null, undefined> {
    return this.d3.select(this.svg.nativeElement);
  }

  private redraw() {
    this.selectSvg()
      .attr('width', this.width)
      .attr('height', this.height);

    const xScale = this.d3.scaleLinear()
      .domain(eventsDomain(this._data))
      .rangeRound([0, this.width]);

    const yScale = this.d3.scaleLinear()
      .domain([0, this._data.length])
      .rangeRound([0, this.height]);

    const selection = this
      .selectSvg()
      .selectAll('rect')
      .data(this._data);

    selection
      .enter()
      .append('rect')
      .classed('bar', true)
      .merge(selection) // enter + update
      .attr('x', (d: TimelineEventForTimeline) => xScale(d.dateBegin.days))
      .attr('y', (d, i) => yScale(i))
      .attr('width', (d: TimelineEventForTimeline) =>
        xScale(d.dateEnd.days) - xScale(d.dateBegin.days)
      )
      .attr('height', (d, i) => yScale(i+1) - yScale(i) - 2);
  }
}

function eventsDomain(events: TimelineEventForTimeline[]): [number, number] {
  const min = events
    .map((event: TimelineEventForTimeline): number => event.dateBegin.days)
    .reduce(
      (prev: number, cur: number): number => Math.min(prev, cur),
      0
    );

  const max = events
    .map((event: TimelineEventForTimeline): number => event.dateEnd.days)
    .reduce(
      (prev: number, cur: number): number => Math.max(prev, cur),
      0
    );

  return [min, max];
}
