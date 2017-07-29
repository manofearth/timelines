export interface TypesState {
  isLoading: boolean;
  isSearching: boolean;
  error: Error;
  types: TimelineEventsTypeForList[];
  query: string;
}

export interface TimelineEventsTypeForList {
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
