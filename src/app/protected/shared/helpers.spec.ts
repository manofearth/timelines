import { getPropDeep } from './helpers';

describe('getPropDeep()', () => {

  it('should return object property or default value if property doesn\'t exist', () => {

    const object: Object = {
      id: 3,
      sub: {
        message: 'msg',
        title: undefined,
        p: {},
      },
    };

    expect(getPropDeep(object, 'id')).toEqual(3);
    expect(getPropDeep(object, 'unknown')).toBeUndefined();
    expect(getPropDeep(object, 'unknown', 'value')).toEqual('value');
    expect(getPropDeep(object, 'unknown.unknown')).toBeUndefined();
    expect(getPropDeep(object, 'id.unknown')).toBeUndefined();
    expect(getPropDeep(object, 'sub')).toEqual({ message: 'msg', title: undefined, p: {} });
    expect(getPropDeep(object, 'sub.message')).toEqual('msg');
    expect(getPropDeep(object, 'sub.message.unknown')).toBeUndefined();
    expect(getPropDeep(object, 'sub.title')).toBeUndefined();
    expect(getPropDeep(object, 'sub.title.unknown')).toBeUndefined();
    expect(getPropDeep(object, 'sub.title.unknown', 'val')).toEqual('val');
    expect(getPropDeep(object, 'sub.p')).toEqual({});
    expect(getPropDeep(object, 'sub.p.unknown')).toBeUndefined();
    expect(getPropDeep(object, 'sub.p.unknown', 'def')).toEqual('def');
  });
});
