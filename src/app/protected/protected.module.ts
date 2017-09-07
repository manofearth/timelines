import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProtectedComponent } from './protected.component';
import { RouterModule } from '@angular/router';
import { TimelinesComponent } from './timelines/timelines.component';
import { LogoutComponent } from './logout/logout.component';
import { TimelineComponent } from './timeline/timeline.component';
import { NgbModalModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { TimelineCanDeactivate } from './timeline/timeline-can-deactivate.service';
import { EventComponent } from './event/event.component';
import { DateParser } from './shared/date-parser/date-parser.service';
import { DateDirective } from './shared/date/date.directive';
import { ChartComponent } from './chart/chart.component';
import { D3Service } from './d3/d3.service';
import { WindowService } from './shared/window.service';
import { TimelineEventTableComponent } from './timeline/events/timeline-events-table.component';
import { GroupComponent } from './group/group.component';
import { ColorPickerComponent } from './shared/color-picker/color-picker.component';
import { TypesComponent } from './types/types.component';
import { SearchFieldComponent } from './shared/search-field/search-field.component';
import { TypeComponent } from './type/type.component';
import { SelectorListComponent } from './shared/selector-list/selector-list.component';
import { SelectorInputComponent } from './shared/selector-input/selector-input.component';
import { SelectorSelectComponent } from './shared/selector-select/selector-select.component';
import { InputDirective } from './shared/input/input.directive';
import { EventsListComponent } from './events/events-list.component';
import { routes } from './protected.routes';

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
    TypeComponent,
    SelectorInputComponent,
    DateDirective,
    ChartComponent,
    ColorPickerComponent,
    TypesComponent,
    SearchFieldComponent,
    SelectorListComponent,
    SelectorSelectComponent,
    InputDirective,
    EventsListComponent,
  ],
  providers: [
    TimelineCanDeactivate,
    DateParser,
    D3Service,
    WindowService,
  ],
  entryComponents: [
    EventComponent,
    GroupComponent,
    TypeComponent,
  ]
})
export class ProtectedModule {
}

