import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { D3Service } from '../d3/d3.service';

@Component({
  selector: 'tl-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements OnInit, AfterViewChecked {

  @ViewChild('container') container: ElementRef;
  @ViewChild('svg') svg: ElementRef;

  constructor(private d3: D3Service) {
  }

  ngOnInit(): void {

    /*Observable
      .fromEvent(window, 'resize')
      .subscribe((e: any) => { console.log(e); });*/

    const chartEl = this.d3.select(this.svg.nativeElement)
      .attr('width', this.width)
      .attr('height', this.height);

    chartEl.selectAll('rect').data([1,2,3]).enter().append('rect')
      .attr('x', 10).attr('y', 10).attr('width', 30).attr('height', 20);
  }

  ngAfterViewChecked(): void {
    console.log(this.container.nativeElement.clientWidth);
  }

  get width(): number {
    return this.container.nativeElement.clientWidth;
  }

  get height(): number {
    return this.container.nativeElement.clientHeight;
  }

  //noinspection JSUnusedGlobalSymbols
  /*@HostListener('window:resize', ['$event'])
  onResize(event: any) {
    console.log(event.target.innerWidth, event.target.innerHeight);
  }*/
}
