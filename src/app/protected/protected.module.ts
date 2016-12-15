import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProtectedComponent } from './protected.component';
import { Routes, RouterModule } from '@angular/router';
import { TimelinesComponent } from './timelines/timelines.component';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
  {
    path: '',
    component: ProtectedComponent,
    children: [
      {
        path: 'timelines',
        component: TimelinesComponent,
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
    ProtectedComponent,
    LogoutComponent,
  ],
})
export class ProtectedModule {
}
