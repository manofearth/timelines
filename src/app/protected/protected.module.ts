import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProtectedComponent } from './protected.component';
import { Routes, RouterModule } from '@angular/router';
import { TimelinesComponent } from './timelines/timelines.component';
import { FirebaseTimelinesEffects } from './timelines/firebase-timelines.effects';
import { EffectsModule } from '@ngrx/effects';
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
    EffectsModule.run(FirebaseTimelinesEffects),
  ],
  declarations: [
    TimelinesComponent,
    ProtectedComponent,
    LogoutComponent,
  ],
})
export default class ProtectedModule {
}
