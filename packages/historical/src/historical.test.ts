/**
 * historical.test.js
 *
 * @description Tests for the historical file.
 *
 * @author jarsmith@indot.in.gov
 * @license MIT
 * @copyright INDOT, 2019
 */

import historical from './historical';

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
      const foo = 'bargahfarga';
      hs.updateURL(foo);
      expect(fakeHistory.push).toHaveBeenCalledWith(foo);
    });

    it('should throw when trying to updateURL if history not provided.', () => {
      expect(() => historical(fakeLocation).updateURL('foobar')).toThrow();
    });
  });
});
