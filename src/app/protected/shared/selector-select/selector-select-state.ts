import { selectorInputInitialState, SelectorInputState } from '../selector-input/selector-input-state';

export interface SelectorSelectState<T> extends SelectorInputState<T> {
  isDropdownVisible: boolean;
}

export const selectorSelectInitialState: SelectorSelectState<any> = {
  ...selectorInputInitialState,
  isDropdownVisible: false,
};
