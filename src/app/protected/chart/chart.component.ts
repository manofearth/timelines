import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { D3Service } from '../d3/d3.service';

@Component({
  selector: 'tl-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements OnInit {

  constructor(private d3: D3Service) {
  }

  ngOnInit(): void {

    /*Observable
      .fromEvent(window, 'resize')
      .subscribe((e: any) => { console.log(e); });*/

    const chartEl = this.d3.select('#chart');
    chartEl.selectAll('rect').data([1,2,3]).enter().append('rect')
      .attr('x', 10).attr('y', 10).attr('width', 30).attr('height', 20);
  }

  //noinspection JSUnusedGlobalSymbols
  /*@HostListener('window:resize', ['$event'])
  onResize(event: any) {
    console.log(event.target.innerWidth, event.target.innerHeight);
  }*/
}
