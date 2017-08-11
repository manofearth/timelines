export interface TypesState {
  isLoading: boolean;
  isSearching: boolean;
  error: Error;
  types: TimelineEventsTypeLight[];
  query: string;
}

export interface TimelineEventsTypeLight {
  id: string;
  title: string;
}

export const typesInitialState: TypesState = {
  isLoading: true,
  isSearching: false,
  error: null,
  types: [],
  query: '',
};
