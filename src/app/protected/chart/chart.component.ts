import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
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
})
export class ChartComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('container') container: ElementRef;
  @ViewChild('svg') svg: ElementRef;

  private windowResizeSubscription: Subscription;

  constructor(
    private d3: D3Service,
    private window: WindowService,
  ) {
  }

  ngOnInit(): void {

    this.refreshSvgSizes();

    this.windowResizeSubscription = this.window.resize$.subscribe(() => {
      this.refreshSvgSizes();
    });
  }

  ngOnDestroy(): void {
    this.windowResizeSubscription.unsubscribe();
  }

  ngAfterViewChecked(): void {
    this.refreshSvgSizes();
  }

  get width(): number {
    return this.window.getComputedWidthAsInt(this.container.nativeElement);
  }

  get height(): number {
    return this.window.getComputedHeightAsInt(this.container.nativeElement);
  }

  @Input('data')
  set data(data: TimelineEventForTimeline[]) {
    const selection = this
      .selectSvg()
      .selectAll('rect')
      .data(data);

    selection
      .enter()
      .append('rect')
      .merge(selection) // enter + update
      .attr('x', (d: TimelineEventForTimeline, i) => (d.dateBegin.days / 10).toFixed(0))
      .attr('y', (d, i) => i * 21)
      .attr('width', (d: TimelineEventForTimeline, i) => ((d.dateEnd.days - d.dateBegin.days) / 10).toFixed(0))
      .attr('height', 20);
  }

  private selectSvg(): Selection<Element, any, null, undefined> {
    return this.d3.select(this.svg.nativeElement);
  }

  private refreshSvgSizes() {
    this.selectSvg()
      .attr('width', this.width)
      .attr('height', this.height);
  }
}
