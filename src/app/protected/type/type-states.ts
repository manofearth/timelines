export interface TypeState {
  status: TypeStateStatus;
  error: Error;
  type: TimelineEventsType;
}

export type TypeStateStatus = 'idle' | 'updating' | 'error' | 'loading' | 'deleting';

export interface TimelineEventsType {
  id: string;
  title: string;
  kind: TypeKind;
  eventsCount: number;
}

export type TypeKind = 'period' | 'date';

export const initialTypeState: TypeState = {
  status: null,
  error: null,
  type: null,
};
