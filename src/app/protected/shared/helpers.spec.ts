import { getPropSafely } from './helpers';

describe('getPropSafely()', () => {

  it('should return object property or default value if property doesn\'t exist', () => {

    const object: Object = {
      id: 3,
      sub: {
        message: 'msg',
        title: undefined,
        p: {},
      },
    };

    expect(getPropSafely(object, 'id')).toEqual(3);
    expect(getPropSafely(object, 'unknown')).toBeUndefined();
    expect(getPropSafely(object, 'unknown', 'value')).toEqual('value');
    expect(getPropSafely(object, 'unknown.unknown')).toBeUndefined();
    expect(getPropSafely(object, 'id.unknown')).toBeUndefined();
    expect(getPropSafely(object, 'sub')).toEqual({ message: 'msg', title: undefined, p: {} });
    expect(getPropSafely(object, 'sub.message')).toEqual('msg');
    expect(getPropSafely(object, 'sub.message.unknown')).toBeUndefined();
    expect(getPropSafely(object, 'sub.title')).toBeUndefined();
    expect(getPropSafely(object, 'sub.title.unknown')).toBeUndefined();
    expect(getPropSafely(object, 'sub.title.unknown', 'val')).toEqual('val');
    expect(getPropSafely(object, 'sub.p')).toEqual({});
    expect(getPropSafely(object, 'sub.p.unknown')).toBeUndefined();
    expect(getPropSafely(object, 'sub.p.unknown', 'def')).toEqual('def');
  });
});