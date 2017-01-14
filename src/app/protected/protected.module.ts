import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProtectedComponent } from './protected.component';
import { Routes, RouterModule } from '@angular/router';
import { TimelinesComponent } from './timelines/timelines.component';
import { LogoutComponent } from './logout/logout.component';
import { TimelineComponent } from './timeline/timeline.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import {TimelineCanDeactivate} from './timeline/timeline-can-deactivate.service';
import { EventComponent } from './event/event.component';
import { SelectorComponent } from './shared/selector/selector.component';
import { DateParser } from './shared/date-parser/date-parser.service';

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
    ],
  },

];

// noinspection JSUnusedGlobalSymbols
@NgModule({
  imports: [
    CommonModule,
    NgbModalModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    TimelinesComponent,
    TimelineComponent,
    ProtectedComponent,
    LogoutComponent,
    EventComponent,
    SelectorComponent,
  ],
  providers: [
    TimelineCanDeactivate,
    DateParser,
  ],
  entryComponents: [
    EventComponent,
  ]
})
export class ProtectedModule {
}
