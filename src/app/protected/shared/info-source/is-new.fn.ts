import { InfoSource } from '../../info-source/info-source-modal.reducer';

export function isNew(event: InfoSource): boolean {
  return event.id === null;
}
