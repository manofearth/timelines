import { isEqual } from './is-equal.fn';
export function ifEmptyObject(obj: Object, ifEmpty: any): any {
  if (Object.keys(obj).length === 0) {
    return ifEmpty;
  } else {
    return obj;
  }
}

export function firstProperty(obj: {}) {
  return Object.keys(obj)[0];
}

export function coalesce(value: any, ifNull: any): any {
  return value === null ? ifNull : value;
}

export function empty(value: any): boolean {
  return value === null || value === undefined || value === '';
}

export function notEmpty(value: any): boolean {
  return !empty(value);
}

export function toInt(value: any): number {
    return parseInt(value, 10);
}

export function spliceOneValue(arr: any[], valueToDelete: any) {
  arr.splice(this.registeredSelects.findIndex(isEqual(valueToDelete)), 1);
}
