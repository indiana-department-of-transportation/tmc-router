import { parseQs, constructQs } from './qs';

describe('constructQs', () => {
  it('should return an empty string when fed an empty object.', () => {
    expect(constructQs({})).toBe('');
  });

  it('should return a basic query string', () => {
    const params = {
      foo: 'bar',
    };
    const result = constructQs(params);
    expect(result).toBe('foo=bar');
  });

  it('should handle multiple key/value pairs', () => {
    const params = {
      foo: 'bar',
      bar: 3,
    };
    const result = constructQs(params);
    expect(result).toBe('foo=bar&bar=3');
  });

  it('should URI encode values', () => {
    const params = {
      foo: '& i am a [uri-encoded] component',
    };
    const result = constructQs(params);
    expect(result).toBe('foo=%26%20i%20am%20a%20%5Buri-encoded%5D%20component');
  });

  it('should de-aggregate Arrays into multiple instances of same key', () => {
    const params = {
      foo: [3, true],
      bar: 'baz',
    };
    const result = constructQs(params);
    expect(result).toBe('foo=3&foo=true&bar=baz');
  });

  it('should automatically convert any Date instances to ISO 8601 strings', () => {
    const now = new Date();
    const old = new Date(2012, 1, 5);
    const params = {
      foo: [3, now],
      bar: old,
    };

    const result = constructQs(params);
    expect(result).toBe(`foo=3&foo=${encodeURIComponent(now.toISOString())}&bar=${encodeURIComponent(old.toISOString())}`);
  });
});

describe('parseQs', () => {
  it('should return an empty object on a blank string.', () => {
    expect(parseQs('')).toEqual({});
  });

  it('should parse a basic query string', () => {
    const qs = 'foo=bar';
    const result = parseQs(qs);
    expect(result.foo).toBe('bar');
  });

  it('should handle multiple key/value pairs', () => {
    const qs = 'foo=bar&baz=foo';
    const result = parseQs(qs);
    expect(result.foo).toBe('bar');
    expect(result.baz).toBe('foo');
  });

  it('should convert numbers, booleans, etc. into their proper representations', () => {
    const qs = 'foo=true&bar=3&baz=null';
    const result = parseQs(qs);
    expect(result.foo).toBe(true);
    expect(result.bar).toBe(3);
    expect(result.baz).toBe(null);
  });

  it('should handle URI encoded values', () => {
    const qs = 'foo=%26%20i%20am%20a%20%5Buri-encoded%5D%20component';
    const result = parseQs(qs);
    expect(result.foo).toBe('& i am a [uri-encoded] component');
  });

  it('should ignore a leading "?"', () => {
    const qs = '?foo=bar';
    const result = parseQs(qs);
    expect(result.foo).toBe('bar');
  });

  it('should aggregate multiple values with the same key into an Array', () => {
    const qs = 'foo=3&foo=true&bar=baz';
    const result = parseQs(qs);
    expect(result.foo).toEqual([3, true]);
    expect(result.bar).toBe('baz');
  });
});
