export interface SelectorState {
  query: string;
  searchResults: SearchResult[];
}

export interface SearchResult {
  title: string;
  item: any;
}
