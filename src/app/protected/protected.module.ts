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
import { EventsAlgoliaSearchEffect } from './events/effects/events-algolia-search.effect';
import { EffectsModule } from '@ngrx/effects';
import { TypeDeleteEffect } from './type/effects/type-delete.effect';
import { SelectorInputBlurEffect } from './shared/selector-input/selector-input-blur.effect';
import { TypeUpdateEffect } from './type/effects/type-update.effect';
import { TypeGetEffect } from './type/effects/type-get.effect';
import { TimelineFirebaseCreateEffect } from './timeline/effects/timeline-firebase-create.effect';
import { TimelineFirebaseDeleteEffect } from './timeline/effects/timeline-firebase-delete.effect';
import { TimelineFirebaseGetEffect } from './timeline/effects/timeline-firebase-get.effect';
import { TimelineFirebaseSaveEffect } from './timeline/effects/timeline-firebase-save.effect';
import { EventFirebaseGetEffect } from './event/effects/event-firebase-get.effect';
import { EventFirebaseInsertEffect } from './event/effects/event-firebase-insert.effect';
import { EventFirebaseUpdateEffect } from './event/effects/event-firebase-update.effect';
import { EventFirebaseDetachEffect } from './event/effects/event-firebase-detach.effect';
import { EventFirebaseAttachEffect } from './event/effects/event-firebase-attach.effect';
import { TimelineFirebaseCreateGroupEffect } from './group/effects/timeline-firebase-create-group.effect';
import { TimelineFirebaseSaveGroupEffect } from './group/effects/timeline-firebase-save-group.effect';
import { TimelineFirebaseDeleteGroupEffect } from './group/effects/timeline-firebase-delete-group.effect';
import { FirebaseTypeCreateEffect } from './type/effects/firebase-type-create.effect';
import { AlgoliaSearchService } from './shared/algolia/algolia-search.service';
import { TimelineEventsElasticSearchService } from './timeline/timeline-events-elastic-search.service';
import { TypesElasticSearchService } from './types/types-elastic-search.service';
import { TypesFirebaseService } from './types/types-firebase.service';
import { EventToTimelineAttachingFirebaseService } from './event/event-to-timeline-attaching-firebase.service';
import { EventsFirebaseService } from './event/events-firebase.service';
import { TimelinesFirebaseService } from './timelines/timelines-firebase.service';
import { TimelinesFirebaseGetEffect } from './timelines/effects/timelines-firebase-get.effect';
import { EventModalEffect } from './event/effects/event-modal.effect';
import { EventsRouterEffect } from './events/effects/events-router.effect';
import { TypesAlgoliaSearchEffect } from './types/effects/types-algolia-search.effect';
import { EventFirebaseDeleteEffect } from './event/effects/event-firebase-delete.effect';
import { EventsAlgoliaClearCacheEffect } from './events/effects/events-algolia-clear-cache.effect';
import { TypesAlgoliaClearCacheEffect } from './types/effects/types-algolia-clear-cache.effect';
import { InfoSourcesListComponent } from './info-sources/info-sources-list.component';
import { InfoSourcesAlgoliaSearchEffect } from './info-sources/effects/info-sources-algolia-search.effect';
import { InfoSourceModalComponent } from './info-source/info-source-modal.component';
import { InfoSourcesRouterEffect } from './info-sources/effects/info-sources-router.effect';
import { InfoSourceModalEffect } from './info-source/effects/info-source-modal.effect';
import { InfoSourceFirebaseInsertEffect } from './info-source/effects/info-source-firebase-insert.effect';
import { InfoSourcesFirebaseService } from './info-sources/info-sources-firebase.service';
import { InfoSourcesAlgoliaClearCacheEffect } from './info-sources/effects/info-sources-algolia-clear-cache.effect';
import { InfoSourceFirebaseUpdateEffect } from './info-source/effects/info-source-firebase-update.effect';
import { InfoSourceFirebaseGetEffect } from './info-source/effects/info-source-firebase-get.effect';
import { SearchableListComponent } from './shared/searchable-list/searchable-list.component';

// noinspection JSUnusedGlobalSymbols
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    NgbTabsetModule,
    RouterModule.forChild(routes),
    EffectsModule.run(TimelinesFirebaseGetEffect),
    EffectsModule.run(TimelineFirebaseCreateEffect),
    EffectsModule.run(TimelineFirebaseDeleteEffect),
    EffectsModule.run(TimelineFirebaseGetEffect),
    EffectsModule.run(TimelineFirebaseSaveEffect),
    EffectsModule.run(EventFirebaseGetEffect),
    EffectsModule.run(EventFirebaseInsertEffect),
    EffectsModule.run(EventFirebaseUpdateEffect),
    EffectsModule.run(EventFirebaseDetachEffect),
    EffectsModule.run(EventFirebaseAttachEffect),
    EffectsModule.run(EventFirebaseDeleteEffect),
    EffectsModule.run(TimelineFirebaseCreateGroupEffect),
    EffectsModule.run(TimelineFirebaseSaveGroupEffect),
    EffectsModule.run(TimelineFirebaseDeleteGroupEffect),
    EffectsModule.run(FirebaseTypeCreateEffect),
    EffectsModule.run(TypesAlgoliaSearchEffect),
    EffectsModule.run(TypeGetEffect),
    EffectsModule.run(TypeUpdateEffect),
    EffectsModule.run(SelectorInputBlurEffect),
    EffectsModule.run(TypeDeleteEffect),
    EffectsModule.run(EventsAlgoliaSearchEffect),
    EffectsModule.run(EventModalEffect),
    EffectsModule.run(EventsRouterEffect),
    EffectsModule.run(EventsAlgoliaClearCacheEffect),
    EffectsModule.run(TypesAlgoliaClearCacheEffect),
    EffectsModule.run(InfoSourcesAlgoliaSearchEffect),
    EffectsModule.run(InfoSourcesRouterEffect),
    EffectsModule.run(InfoSourceModalEffect),
    EffectsModule.run(InfoSourceFirebaseInsertEffect),
    EffectsModule.run(InfoSourceFirebaseUpdateEffect),
    EffectsModule.run(InfoSourceFirebaseGetEffect),
    EffectsModule.run(InfoSourcesAlgoliaClearCacheEffect),
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
    InfoSourcesListComponent,
    InfoSourceModalComponent,
    SearchableListComponent,
  ],
  providers: [
    TimelineCanDeactivate,
    DateParser,
    D3Service,
    WindowService,
    TimelinesFirebaseService,
    EventsFirebaseService,
    EventToTimelineAttachingFirebaseService,
    TypesFirebaseService,
    TypesElasticSearchService,
    TimelineEventsElasticSearchService,
    AlgoliaSearchService,
    InfoSourcesFirebaseService,
  ],
  entryComponents: [
    EventComponent,
    GroupComponent,
    TypeComponent,
    InfoSourceModalComponent,
  ]
})
export class ProtectedModule {
}
