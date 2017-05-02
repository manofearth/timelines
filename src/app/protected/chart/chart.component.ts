import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { D3Service } from '../d3/d3.service';
import { WindowService } from '../window/window.service';
import { Selection } from 'd3-selection';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'tl-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('container') container: ElementRef;
  @ViewChild('svg') svg: ElementRef;

  private svgSelection: Selection<Element, any, null, undefined>;
  private windowResizeSubscription: Subscription;

  constructor(
    private d3: D3Service,
    private window: WindowService,
  ) {
  }

  ngOnInit(): void {

    this.svgSelection = this.d3.select(this.svg.nativeElement);
    this.refreshSvgSizes();

    this.svgSelection.selectAll('rect').data([1,2,3]).enter().append('rect')
      .attr('x', 10).attr('y', 10).attr('width', 30).attr('height', 20);

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

  private refreshSvgSizes() {
    this.svgSelection
      .attr('width', this.width)
      .attr('height', this.height);
  }
}
