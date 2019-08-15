/**
 * index.ts
 * 
 * @description Main file for the historical library.
 * 
 * @author Jared Smith
 * @license MIT
 */

// Plain Old Javascript Object
interface IPojo {
  [key: string]: any,
};

// Object that only contains valid JSON values.
interface IJsonObject {
  [key: string]: boolean | string | number | null | Array<IJsonObject> | IJsonObject,
}

interface ILocation {
  pathname: string,
  search: string,
};

interface IHistory {
  push: (arg: string) => any,
};

/**
 * @description Attempts to parse the argument as JSON. On failure returns an empty object.
 *
 * @param {string} json The thing to attempt parsing.
 * @returns {Object} The result.
 */
const tryParse = (json: string): IJsonObject => {
  let result = json;
  try {
    result = JSON.parse(json);
  } catch (_e) {
    // no-op
  }

  return {};
};

/**
 * @description reduces an array of arrays in [[key, value]] format into an object.
 * Because of the need to compress multiple entries from the same key into an Array,
 * we can't use Object.fromEntries.
 *
 * @param {Object} params The accumulating object for the reduce call.
 * @param {Array} [arr] The destructured key/value sub-array.
 * @returns {Object} The updated parameter object.
 */
const reducer = (params: IPojo, [key, value]: string[]): IPojo => {
  const val = Array.isArray(value)
    ? value.map(tryParse)
    : tryParse(value);

  if (key in params) {
    if (Array.isArray(params[key])) {
      params[key].push(val);
    } else {
      params[key] = [params[key], val];
    }
  } else {
    params[key] = val;
  }

  return params;
};

/**
 * @description Parses a query string into an object. Keys with multiple entries are
 * condensed into an Array with the values in the order they appear in the query
 * string. This is only used as a fallback in the case that a built-in solution
 * is unavailable.
 *
 * @param {string} qs The query string to parse.
 * @returns {Object} The paramter object.
 */
export const fallback = (qs: string): IPojo => {
  if (!qs) return {};
  const q = qs.indexOf('?') === 0
    ? qs.slice(1)
    : qs;

  // Just in case caller passed a fragment identifier.
  const query = q.split('#')[0];

  return query
    .split('&')
    .map(item => item.split('=').map(decodeURIComponent))
    .reduce(reducer, {});
};

/**
 * @description Parses a query string into an object. Keys with multiple entries are
 * condensed into an Array with the values in the order they appear in the query
 * string. Attempts to use built-ins like URLSearchParams or the qs library in
 * node.js.
 *
 * @param {string} qs The query string to parse.
 * @returns {Object} The parameter object.
 */
export const parseQs = (qs: string): IPojo => {
  if (!qs) return {};
  if (typeof URLSearchParams !== 'undefined') {
    return [...new URLSearchParams(qs)]
      .reduce(reducer, {});
  }

  // Fallback
  return fallback(qs);
};

/**
 * @description Converts an object into a query string.
 *
 * @param {Object} params The parameters object.
 * @returns {string} The HTTP query string.
 */
export const constructQs = (params: IPojo): string => {
  if (!params) return '';
  return Object.entries(params)
    .filter(([key, value]) => {
      if (!key) return false;
      if (Array.isArray(value)) return value.length;
      return value !== '' && value !== undefined;
    })
    .map(([key, value]) => {
      const k = encodeURIComponent(key);
      if (Array.isArray(value)) {
        return value
          .filter(v2 => v2 !== '' && v2 !== undefined)
          .map(v2 => `${k}=${encodeURIComponent(v2)}`)
          .join('&');
      }

      return `${k}=${encodeURIComponent(`${value}`)}`;
    })
    .join('&');
};

/**
 * @description Throws an error.
 *
 * @returns {undefined} Nothing, throws an error.
 */
const errFn = (): undefined => {
  throw new Error('History API object not provided!');
};

/**
 * @description Custom API for interacting with the location and history
 * provided by react-router-dom.
 *
 * @param {Any} location The current navigation location.
 * @param {Any} history The history API object.
 * @returns {Object} The API object.
 */
export const historical = (location: ILocation, history: IHistory) => ({
  currentPath: location.pathname,
  searchParams: parseQs(location.search),
  currentRoute: location.pathname + location.search,
  updateURL: history
    ? (url: string) => {
      const currentLocation = location.pathname + location.search;
      if (currentLocation !== url) {
        history.push(url);
      }
    }
    : errFn,
});

export default historical;
