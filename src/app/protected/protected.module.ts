import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProtectedComponent } from './protected.component';
import { Routes, RouterModule } from '@angular/router';
import { TimelinesComponent } from './timelines/timelines.component';
import { LogoutComponent } from './logout/logout.component';
import { TimelineComponent } from './timeline/timeline.component';
import { NgbModalModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import {TimelineCanDeactivate} from './timeline/timeline-can-deactivate.service';
import { EventComponent } from './event/event.component';
import { SelectorComponent } from './shared/selector/selector.component';
import { DateParser } from './shared/date-parser/date-parser.service';
import { DateDirective } from './date/date.directive';
import { ChartComponent } from './chart/chart.component';
import { D3Service } from './d3/d3.service';
import { WindowService } from './shared/window.service';
import { TimelineEventsElasticSearchService } from './timeline/timeline-events-elastic-search.service';
import { TimelineEventTableComponent } from './timeline/events/timeline-events-table.component';
import { GroupComponent } from './group/group.component';
import { ColorPickerComponent } from './shared/color-picker/color-picker.component';
import { TypesComponent } from './types/types.component';
import { TimelineEventsSelectorSearchService } from './timeline/timeline-events-selector-search.service';
import { TypesSearchService } from './types/types-search.service';
import { SearchFieldComponent } from './shared/search-field/search-field.component';

const routes: Routes = [
  {
    path: '',
    component: ProtectedComponent,
    children: [
      {
        path: 'timelines',
        component: TimelinesComponent,
      },
      {
        path: 'timeline/:id',
        component: TimelineComponent,
        canDeactivate: [TimelineCanDeactivate],
      },
      {
        path: 'types',
        component: TypesComponent,
      }
    ],
  },
];

// noinspection JSUnusedGlobalSymbols
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    NgbTabsetModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    TimelinesComponent,
    TimelineComponent,
    TimelineEventTableComponent,
    ProtectedComponent,
    LogoutComponent,
    EventComponent,
    GroupComponent,
    SelectorComponent,
    DateDirective,
    ChartComponent,
    ColorPickerComponent,
    TypesComponent,
    SearchFieldComponent,
  ],
  providers: [
    TimelineCanDeactivate,
    DateParser,
    D3Service,
    WindowService,
    TimelineEventsElasticSearchService,
    TimelineEventsSelectorSearchService,
    TypesSearchService,
  ],
  entryComponents: [
    EventComponent,
    GroupComponent,
  ]
})
export class ProtectedModule {
}
