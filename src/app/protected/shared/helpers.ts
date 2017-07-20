export function getPropSafely(object: Object, propertyPath: string, defaultValue?: any): any {
  if (object === null || object === undefined) {
    return defaultValue;
  }

  if (propertyPath.length === 0) {
    return object;
  }

  const propertyPathArray: string[] = propertyPath.split('.');

  // Рекурсия намеренная.
  // noinspection TailRecursionJS
  return getPropSafely(object[propertyPathArray[0]], propertyPathArray.slice(1).join('.'), defaultValue);
}
