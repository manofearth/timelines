export interface TypeState {
  isLoading: boolean;
  error: Error;
  type: TimelineEventsType;
}

export interface TimelineEventsType {
  id: string;
  title: string;
}

export const initialTypeState: TypeState = {
  isLoading: false,
  error: null,
  type: null,
};
