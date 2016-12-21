import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProtectedComponent } from './protected.component';
import { Routes, RouterModule } from '@angular/router';
import { TimelinesComponent } from './timelines/timelines.component';
import { LogoutComponent } from './logout/logout.component';
import { TimelineComponent } from './timeline/timeline.component';

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
      },
    ],
  },

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    TimelinesComponent,
    TimelineComponent,
    ProtectedComponent,
    LogoutComponent,
  ],
})
export class ProtectedModule {
}