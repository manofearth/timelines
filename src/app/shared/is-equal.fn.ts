export function isEqual(value2: any): (value1: any) => boolean {
    return value1 => value1 === value2;
}
