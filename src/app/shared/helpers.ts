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
