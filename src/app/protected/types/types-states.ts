export interface TypesState {
  isLoading: boolean;
  error: Error;
  types: TimelineEventsTypeForList[];
}

export interface TimelineEventsTypeForList {
  id: string;
  title: string;
}
