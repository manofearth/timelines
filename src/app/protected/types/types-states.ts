export interface TypesState {
  isLoading: boolean;
  error: Error;
  types: TimelineEventsType[];
}

export interface TimelineEventsType {
  id: string;
  title: string;
}
