export function isEqualDeep(obj1: Object, obj2: Object): boolean {
  return Object.keys(obj1).reduce((isEqual, key) => {

    if (!isEqual) return false;

    if (obj2[key] === undefined) return false;

    if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      return isEqualDeep(obj1[key], obj2[key]);
    } else {
      return obj1[key] === obj2[key];
    }

  }, true);
}
