export function getProp<T>(object: T, property: keyof T, defaultValue: any): any {
  return object ? (object[property] ? object[property] : defaultValue) : defaultValue;
}


export function getPropDeep(object: Object, propertyPath: string, defaultValue?: any): any {
  if (object === null || object === undefined) {
    return defaultValue;
  }

  if (propertyPath.length === 0) {
    return object;
  }

  const propertyPathArray: string[] = propertyPath.split('.');

  return getPropDeep(object[propertyPathArray[0]], propertyPathArray.slice(1).join('.'), defaultValue);
}
