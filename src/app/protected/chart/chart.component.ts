import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
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

  @Output('onSelect') onSelect: EventEmitter<TimelineEventForTimeline> = new EventEmitter();

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

    const data: TimelineEventForTimelineWithYPosition[] = toEventWithYPosition(this._data);

    this.selectSvg()
      .attr('width', this.width)
      .attr('height', this.height);

    const xScale = this.d3.scaleLinear()
      .domain(eventsXDomain(data))
      .range([0, this.width]);

    const yScale = this.d3.scaleLinear()
      .domain(eventsYDomain(data))
      .range([0, this.height]);

    const bars = this
      .selectSvg()
      .selectAll('rect')
      .data(data);

    bars.exit().remove();

    bars
      .enter()
      .append('rect')
      .classed('bar', true)
      .on('click', (d: TimelineEventForTimeline) => {
        this.onSelect.emit(d);
      })
      .on('mouseover', () => {
        this.d3.selectEventTarget().classed('mouseover', true);
      })
      .on('mouseout', () => {
        this.d3.selectEventTarget().classed('mouseover', false);
      })
      .merge(bars) // enter + update
      .attr('x', (d: TimelineEventForTimelineWithYPosition) => xScale(d.dateBegin.days))
      .attr('y', (d: TimelineEventForTimelineWithYPosition) => yScale(d.yPos))
      .attr('width', (d: TimelineEventForTimeline) =>
        xScale(d.dateEnd.days) - xScale(d.dateBegin.days)
      )
      .attr('height', (d: TimelineEventForTimelineWithYPosition) =>
        yScale(d.yPos + 1) - yScale(d.yPos) - 2
      );

    const texts = this
      .selectSvg()
      .selectAll('text.title')
      .data(data);

    texts.exit().remove();

    texts
      .enter()
      .append('text')
      .classed('title', true)
      .attr('alignment-baseline', 'middle')
      .attr('pointer-events', 'none')
      .merge(texts) // enter + update
      .text((d: TimelineEventForTimeline) => d.title)
      .attr('x', (d: TimelineEventForTimelineWithYPosition) => xScale(d.dateBegin.days))
      .attr('dx', 4)
      .attr('y', (d: TimelineEventForTimelineWithYPosition) => yScale(d.yPos))
      .attr('dy', (d: TimelineEventForTimelineWithYPosition) => (yScale(d.yPos + 1) - yScale(d.yPos) - 2) / 2)
      .attr('width', (d: TimelineEventForTimeline) =>
        xScale(d.dateEnd.days) - xScale(d.dateBegin.days)
      )
      .attr('height', (d: TimelineEventForTimelineWithYPosition) =>
        yScale(d.yPos + 1) - yScale(d.yPos) - 2
      );

    this.selectSvg().select('g')
      .attr('transform', 'translate(0,' + (this.height - 20) + ')')
      .call(this.d3.axisBottom(xScale));

  }
}

function eventsXDomain(events: TimelineEventForTimeline[]): [number, number] {
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

function eventsYDomain(events: TimelineEventForTimelineWithYPosition[]): [number, number] {
  return [
    0,
    events
      .map((event: TimelineEventForTimelineWithYPosition) => event.yPos)
      .reduce((prev: number, cur: number) => Math.max(prev, cur))
  ];
}

function toEventWithYPosition(events: TimelineEventForTimeline[]): TimelineEventForTimelineWithYPosition[] {

  const levels: TimelineEventForTimeline[][] = [];

  return events.map((event: TimelineEventForTimeline): TimelineEventForTimelineWithYPosition => {
    const levelIndex = levels.findIndex((level: TimelineEventForTimeline[]): boolean => {
      return level.every((eventInLevel: TimelineEventForTimeline) => {
        return eventInLevel.dateBegin.days >= event.dateEnd.days || eventInLevel.dateEnd.days <= event.dateBegin.days;
      });
    });

    if (levelIndex === -1) {
      levels.push([event]);
      return { ...event, yPos: levels.length - 1 };
    } else {
      levels[levelIndex].push(event);
      return { ...event, yPos: levelIndex };
    }

  });
}

interface  TimelineEventForTimelineWithYPosition extends TimelineEventForTimeline {
  yPos: number;
}
