import { Routes } from '@angular/router';
import { ProtectedComponent } from './protected.component';
import { TimelinesComponent } from './timelines/timelines.component';
import { TimelineComponent } from './timeline/timeline.component';
import { TimelineCanDeactivate } from './timeline/timeline-can-deactivate.service';
import { TypesComponent } from './types/types.component';
import { EventsListComponent } from './events/events-list.component';
import { InfoSourcesListComponent } from './info-sources-list/info-sources-list.component';

export const routes: Routes = [
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
        canDeactivate: [ TimelineCanDeactivate ],
      },
      {
        path: 'types',
        component: TypesComponent,
      },
      {
        path: 'events',
        component: EventsListComponent,
        children: [
          {
            path: ':id'
          }
        ]
      },
      {
        path: 'info-sources',
        component: InfoSourcesListComponent,
      }
    ],
  },
];
