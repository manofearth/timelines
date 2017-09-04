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
  ViewEncapsulation
} from '@angular/core';
import { D3Service } from '../d3/d3.service';
import { WindowService } from '../shared/window.service';
import { Selection } from 'd3-selection';
import { Subscription } from 'rxjs/Subscription';
import { TimelineEventForTimeline, TimelineEventsGroup } from '../timeline/timeline-states';
import { AppState } from '../../reducers';
import { Action, Store } from '@ngrx/store';

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
  private _data: TimelineEventsGroup[];
  private canvasHeight = 180;
  private margins = {
    top: 0,
    bottom: 30,
    left: 10,
    right: 10,
  };

  constructor(
    private d3: D3Service,
    private window: WindowService,
    private store: Store<AppState>,
  ) {
  }

  ngOnInit() {

    this.redraw();

    this.windowResizeSubscription = this.window.resize$.subscribe(() => {
      this.redraw();
    });
  }

  ngOnDestroy() {
    this.windowResizeSubscription.unsubscribe();
  }

  ngAfterViewChecked() {
    this.redraw();
  }

  onEventClick(event: TimelineEventForTimeline) {
    const action: ChartEventClickAction = {
      type: 'CHART_EVENT_CLICK',
      payload: {
        eventId: event.id,
      }
    };
    this.store.dispatch(action);
    this.onSelect.emit(event);
  }

  get width(): number {
    return this.container.nativeElement.clientWidth - 5;
  }

  get height(): number {
    return this.canvasHeight;
  }

  @Input('data')
  set data(data: TimelineEventsGroup[]) {
    this._data = data;
    this.redraw();
  }

  private selectSvg(): Selection<Element, any, null, undefined> {
    return this.d3.select(this.svg.nativeElement);
  }

  private redraw() {

    const data: TimelineEventForChart[] = toEventsForChart(this._data);

    this.selectSvg()
      .attr('width', this.width)
      .attr('height', this.height);

    const axisXDomain = eventsXDomain(data);

    const xScale = this.d3.scaleLinear()
      .domain(axisXDomain)
      .range([this.margins.left, this.width - this.margins.right]);

    const axisXScale = this.d3.scaleLinear()
      .domain(axisXDomain.map(v => v / DAYS_IN_GRIGORIAN_YEAR))
      .range([this.margins.left, this.width - this.margins.right]);

    this.selectSvg().select('g')
      .attr('transform', 'translate(0,' + (this.height - this.margins.bottom + 5) + ')')
      .call(
        this.d3.axisBottom(axisXScale)
          .tickFormat((v: number) => Number.isInteger(v) ? (v).toFixed(0) : '')
      );

    const yScale = this.d3.scaleLinear()
      .domain(eventsYDomain(data))
      .range([this.margins.top, this.height - this.margins.bottom]);

    const bars = this
      .selectSvg()
      .selectAll('rect')
      .data(data.filter((d: TimelineEventForTimeline) => d.type.kind !== 'date'));

    bars.exit().remove();

    bars
      .enter()
      .append('rect')
      .classed('bar', true)
      .attr('rx', 3)
      .attr('ry', 3)
      .on('click', (d: TimelineEventForTimeline) => {
        this.onEventClick(d);
      })
      .on('mouseover', () => {
        this.d3.selectEventTarget().classed('mouseover', true);
      })
      .on('mouseout', () => {
        this.d3.selectEventTarget().classed('mouseover', false);
      })
      .merge(bars) // enter + update
      .style('fill', d => d.color)
      .attr('x', d => xScale(d.dateBegin.days))
      .attr('y', d => yScale(d.yPos))
      .attr('width', (d: TimelineEventForTimeline) =>
        xScale(d.dateEnd.days) - xScale(d.dateBegin.days)
      )
      .attr('height', (d: TimelineEventForChart) =>
        yScale(d.yPos + 1) - yScale(d.yPos) - 2
      );

    const circles = this
      .selectSvg()
      .selectAll('circle')
      .data(data.filter((d: TimelineEventForTimeline) => d.type.kind === 'date'));

    circles.exit().remove();

    circles
      .enter()
      .append('circle')
      .style('stroke', 'white')
      .on('mouseover', () => {
        this.d3.selectEventTarget().classed('mouseover', true);
      })
      .on('mouseout', () => {
        this.d3.selectEventTarget().classed('mouseover', false);
      })
      .on('click', (d: TimelineEventForTimeline) => {
        this.onEventClick(d);
      })
      .merge(circles)
      .style('fill', d => d.color)
      .attr('cx', d => xScale(d.dateBegin.days))
      .attr('cy', d => yScale(d.yPos) + (yScale(d.yPos + 1) - yScale(d.yPos))/2)
      .attr('r', 5);

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
      .attr('x', (d: TimelineEventForChart) => xScale(d.dateBegin.days))
      .attr('dx', 4)
      .attr('y', (d: TimelineEventForChart) => yScale(d.yPos))
      .attr('dy', (d: TimelineEventForChart) => (yScale(d.yPos + 1) - yScale(d.yPos) - 2) / 2)
      .attr('width', (d: TimelineEventForTimeline) =>
        xScale(d.dateEnd.days) - xScale(d.dateBegin.days)
      )
      .attr('height', (d: TimelineEventForChart) =>
        yScale(d.yPos + 1) - yScale(d.yPos) - 2
      );

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

const DAYS_IN_GRIGORIAN_YEAR = 365.2425;

function eventsYDomain(events: TimelineEventForChart[]): [number, number] {
  return [
    0,
    events
      .map<number>((event: TimelineEventForChart) => event.yPos)
      .reduce<number>((prev, cur) => Math.max(prev, cur), 0) + 1
  ];
}

function toEventsForChart(groups: TimelineEventsGroup[]): TimelineEventForChart[] {

  const levels: TimelineEventForTimeline[][] = [];

  return groups
    .reduce<TimelineEventWithGroupData[]>((acc, group) => {
      return acc.concat(group.events.map<TimelineEventWithGroupData>(enrichWithGroupData(group)));
    }, [])
    .map<TimelineEventForChart>(event => {

      const levelIndex = levels.findIndex(level => level.every(notOverlaps(event)));

      if (levelIndex === -1) {
        levels.push([event]);
        return { ...event, yPos: levels.length - 1 };
      } else {
        levels[levelIndex].push(event);
        return { ...event, yPos: levelIndex };
      }

    });
}

function enrichWithGroupData(group: TimelineEventsGroup): (event: TimelineEventForTimeline) => TimelineEventWithGroupData {
  return event => ({ ...event, groupId: group.id, color: group.color });
}

function notOverlaps(e1: TimelineEventWithGroupData): (e2: TimelineEventWithGroupData) => boolean {
  return function (e2: TimelineEventWithGroupData) {
    return e1.groupId === e2.groupId && (e2.dateBegin.days >= e1.dateEnd.days || e2.dateEnd.days <= e1.dateBegin.days);
  }
}

interface TimelineEventWithGroupData extends TimelineEventForTimeline {
  groupId: string;
  color: string;
}

interface  TimelineEventForChart extends TimelineEventWithGroupData {
  yPos: number;
}

export interface ChartEventClickAction extends Action {
  type: 'CHART_EVENT_CLICK';
  payload: {
    eventId: string;
  }
}
