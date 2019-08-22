/**
 * historical.test.js
 *
 * @description Tests for the historical file.
 *
 * @author jarsmith@indot.in.gov
 * @license MIT
 * @copyright INDOT, 2019
 */

import { historical, parseQs, constructQs } from '../dist/historical';

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

const fakeLocation = {
  pathname: '/foo/bar',
  search: '?foo=bar',
};

let fakeHistory = {
  push: jest.fn(),
};

let hs = historical(fakeLocation, fakeHistory);

describe('historical', () => {
  beforeEach(() => {
    fakeHistory = {
      push: jest.fn(),
    };

    hs = historical(fakeLocation, fakeHistory);
  });

  it('should return an API object', () => {
    expect(typeof hs).toBe('object');
  });

  describe('API', () => {
    it('should have a currentPath property', () => {
      expect(hs.currentPath).toBe(fakeLocation.pathname);
    });

    it('should have a searchParams property', () => {
      expect(hs.searchParams).toEqual({
        foo: 'bar',
      });
    });

    it('should have a currentRoute property', () => {
      expect(hs.currentRoute).toBe(fakeLocation.pathname + fakeLocation.search);
    });

    it('should have an updateURL method', () => {
      expect(typeof hs.updateURL).toBe('function');
      const foo = {};
      hs.updateURL(foo);
      expect(fakeHistory.push).toHaveBeenCalledWith(foo);
    });

    it('should throw when trying to updateURL if history not provided.', () => {
      expect(() => historical(fakeLocation).updateURL()).toThrow();
    });
  });
});
