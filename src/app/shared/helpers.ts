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

export function spliceOneValue<T>(arr: T[], valueToDelete: T) {
  spliceOneIndex(arr, arr.findIndex(isEqual(valueToDelete)));
}

export function spliceOneIndex<T>(arr: T[], indexToDelete: number) {
  arr.splice(indexToDelete, 1);
}

export function deleteOneIndex<T>(arr: T[], indexToDelete: number): T[] {
  const arrClone = [...arr];
  spliceOneIndex(arrClone, indexToDelete);
  return arrClone;
}

export function push<T>(arr: T[], value: T): T[] {
  const arrClone = [...arr];
  arrClone.push(value);
  return arrClone;
}

export function flatten<T>(arr: T[][]): T[] {
  return Array.prototype.concat(...arr);
}

export function setToArr<T>(arr: T[], index: number, value: T): T[] {
  const arrClone = [...arr];
  arrClone[index] = value;
  return arrClone;
}

export function setToObj<T extends Object, K extends keyof T>(obj: T, prop: K, value: T[K]): T {
  return Object.assign({}, obj, { [prop as string]: value });
}
