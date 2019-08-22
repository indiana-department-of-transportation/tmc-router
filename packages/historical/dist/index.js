"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.undefined = mod.exports;
  }
})(void 0, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  /**
   * index.ts
   * 
   * @description Main file for the historical library.
   * 
   * @author Jared Smith
   * @license MIT
   */
  // Plain Old Javascript Object
  ; // Object that only contains valid JSON values.

  ;
  ;
  /**
   * @description Attempts to parse the argument as JSON. On failure returns an empty object.
   *
   * @param {string} json The thing to attempt parsing.
   * @returns {Object} The result.
   */

  var tryParse = function tryParse(json) {
    var result = json;

    try {
      result = JSON.parse(json);
    } catch (_e) {// no-op
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


  var reducer = function reducer(params, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    var val = Array.isArray(value) ? value.map(tryParse) : tryParse(value);

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


  var fallback = exports.fallback = function fallback(qs) {
    if (!qs) return {};
    var q = qs.indexOf('?') === 0 ? qs.slice(1) : qs; // Just in case caller passed a fragment identifier.

    var query = q.split('#')[0];
    return query.split('&').map(function (item) {
      return item.split('=').map(decodeURIComponent);
    }).reduce(reducer, {});
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


  var parseQs = exports.parseQs = function parseQs(qs) {
    if (!qs) return {};

    if (typeof URLSearchParams !== 'undefined') {
      return _toConsumableArray(new URLSearchParams(qs)).reduce(reducer, {});
    } // Fallback


    return fallback(qs);
  };
  /**
   * @description Converts an object into a query string.
   *
   * @param {Object} params The parameters object.
   * @returns {string} The HTTP query string.
   */


  var constructQs = exports.constructQs = function constructQs(params) {
    if (!params) return '';
    return Object.entries(params).filter(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          key = _ref4[0],
          value = _ref4[1];

      if (!key) return false;
      if (Array.isArray(value)) return value.length;
      return value !== '' && value !== undefined;
    }).map(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
          key = _ref6[0],
          value = _ref6[1];

      var k = encodeURIComponent(key);

      if (Array.isArray(value)) {
        return value.filter(function (v2) {
          return v2 !== '' && v2 !== undefined;
        }).map(function (v2) {
          return "".concat(k, "=").concat(encodeURIComponent(v2));
        }).join('&');
      }

      return "".concat(k, "=").concat(encodeURIComponent("".concat(value)));
    }).join('&');
  };
  /**
   * @description Throws an error.
   *
   * @returns {undefined} Nothing, throws an error.
   */


  var errFn = function errFn() {
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


  var historical = exports.historical = function historical(location, history) {
    return {
      currentPath: location.pathname,
      searchParams: parseQs(location.search),
      currentRoute: location.pathname + location.search,
      updateURL: history ? function (url) {
        var currentLocation = location.pathname + location.search;

        if (currentLocation !== url) {
          history.push(url);
        }
      } : errFn
    };
  };

  exports["default"] = historical;
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUMsUUFEK0M7QUFFckUsTUFBQSxZQUFZLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFWLENBRmdEO0FBR3JFLE1BQUEsWUFBWSxFQUFFLFFBQVEsQ0FBQyxRQUFULEdBQW9CLFFBQVEsQ0FBQyxNQUgwQjtBQUlyRSxNQUFBLFNBQVMsRUFBRSxPQUFPLEdBQ2QsVUFBQyxHQUFELEVBQWlCO0FBQ2pCLFlBQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxRQUFULEdBQW9CLFFBQVEsQ0FBQyxNQUFyRDs7QUFDQSxZQUFJLGVBQWUsS0FBSyxHQUF4QixFQUE2QjtBQUMzQixVQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsR0FBYjtBQUNEO0FBQ0YsT0FOZSxHQU9kO0FBWGlFLEtBQTdDO0FBQUEsR0FBbkI7O3VCQWNRLFUiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGluZGV4LnRzXG4gKiBcbiAqIEBkZXNjcmlwdGlvbiBNYWluIGZpbGUgZm9yIHRoZSBoaXN0b3JpY2FsIGxpYnJhcnkuXG4gKiBcbiAqIEBhdXRob3IgSmFyZWQgU21pdGhcbiAqIEBsaWNlbnNlIE1JVFxuICovXG5cbi8vIFBsYWluIE9sZCBKYXZhc2NyaXB0IE9iamVjdFxuaW50ZXJmYWNlIElQb2pvIHtcbiAgW2tleTogc3RyaW5nXTogYW55LFxufTtcblxuLy8gT2JqZWN0IHRoYXQgb25seSBjb250YWlucyB2YWxpZCBKU09OIHZhbHVlcy5cbmludGVyZmFjZSBJSnNvbk9iamVjdCB7XG4gIFtrZXk6IHN0cmluZ106IGJvb2xlYW4gfCBzdHJpbmcgfCBudW1iZXIgfCBudWxsIHwgQXJyYXk8SUpzb25PYmplY3Q+IHwgSUpzb25PYmplY3QsXG59XG5cbmludGVyZmFjZSBJTG9jYXRpb24ge1xuICBwYXRobmFtZTogc3RyaW5nLFxuICBzZWFyY2g6IHN0cmluZyxcbn07XG5cbmludGVyZmFjZSBJSGlzdG9yeSB7XG4gIHB1c2g6IChhcmc6IHN0cmluZykgPT4gYW55LFxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb24gQXR0ZW1wdHMgdG8gcGFyc2UgdGhlIGFyZ3VtZW50IGFzIEpTT04uIE9uIGZhaWx1cmUgcmV0dXJucyBhbiBlbXB0eSBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGpzb24gVGhlIHRoaW5nIHRvIGF0dGVtcHQgcGFyc2luZy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSByZXN1bHQuXG4gKi9cbmNvbnN0IHRyeVBhcnNlID0gKGpzb246IHN0cmluZyk6IElKc29uT2JqZWN0ID0+IHtcbiAgbGV0IHJlc3VsdCA9IGpzb247XG4gIHRyeSB7XG4gICAgcmVzdWx0ID0gSlNPTi5wYXJzZShqc29uKTtcbiAgfSBjYXRjaCAoX2UpIHtcbiAgICAvLyBuby1vcFxuICB9XG5cbiAgcmV0dXJuIHt9O1xufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb24gcmVkdWNlcyBhbiBhcnJheSBvZiBhcnJheXMgaW4gW1trZXksIHZhbHVlXV0gZm9ybWF0IGludG8gYW4gb2JqZWN0LlxuICogQmVjYXVzZSBvZiB0aGUgbmVlZCB0byBjb21wcmVzcyBtdWx0aXBsZSBlbnRyaWVzIGZyb20gdGhlIHNhbWUga2V5IGludG8gYW4gQXJyYXksXG4gKiB3ZSBjYW4ndCB1c2UgT2JqZWN0LmZyb21FbnRyaWVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgVGhlIGFjY3VtdWxhdGluZyBvYmplY3QgZm9yIHRoZSByZWR1Y2UgY2FsbC5cbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJdIFRoZSBkZXN0cnVjdHVyZWQga2V5L3ZhbHVlIHN1Yi1hcnJheS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSB1cGRhdGVkIHBhcmFtZXRlciBvYmplY3QuXG4gKi9cbmNvbnN0IHJlZHVjZXIgPSAocGFyYW1zOiBJUG9qbywgW2tleSwgdmFsdWVdOiBzdHJpbmdbXSk6IElQb2pvID0+IHtcbiAgY29uc3QgdmFsID0gQXJyYXkuaXNBcnJheSh2YWx1ZSlcbiAgICA/IHZhbHVlLm1hcCh0cnlQYXJzZSlcbiAgICA6IHRyeVBhcnNlKHZhbHVlKTtcblxuICBpZiAoa2V5IGluIHBhcmFtcykge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHBhcmFtc1trZXldKSkge1xuICAgICAgcGFyYW1zW2tleV0ucHVzaCh2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJhbXNba2V5XSA9IFtwYXJhbXNba2V5XSwgdmFsXTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcGFyYW1zW2tleV0gPSB2YWw7XG4gIH1cblxuICByZXR1cm4gcGFyYW1zO1xufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb24gUGFyc2VzIGEgcXVlcnkgc3RyaW5nIGludG8gYW4gb2JqZWN0LiBLZXlzIHdpdGggbXVsdGlwbGUgZW50cmllcyBhcmVcbiAqIGNvbmRlbnNlZCBpbnRvIGFuIEFycmF5IHdpdGggdGhlIHZhbHVlcyBpbiB0aGUgb3JkZXIgdGhleSBhcHBlYXIgaW4gdGhlIHF1ZXJ5XG4gKiBzdHJpbmcuIFRoaXMgaXMgb25seSB1c2VkIGFzIGEgZmFsbGJhY2sgaW4gdGhlIGNhc2UgdGhhdCBhIGJ1aWx0LWluIHNvbHV0aW9uXG4gKiBpcyB1bmF2YWlsYWJsZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcXMgVGhlIHF1ZXJ5IHN0cmluZyB0byBwYXJzZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBwYXJhbXRlciBvYmplY3QuXG4gKi9cbmV4cG9ydCBjb25zdCBmYWxsYmFjayA9IChxczogc3RyaW5nKTogSVBvam8gPT4ge1xuICBpZiAoIXFzKSByZXR1cm4ge307XG4gIGNvbnN0IHEgPSBxcy5pbmRleE9mKCc/JykgPT09IDBcbiAgICA/IHFzLnNsaWNlKDEpXG4gICAgOiBxcztcblxuICAvLyBKdXN0IGluIGNhc2UgY2FsbGVyIHBhc3NlZCBhIGZyYWdtZW50IGlkZW50aWZpZXIuXG4gIGNvbnN0IHF1ZXJ5ID0gcS5zcGxpdCgnIycpWzBdO1xuXG4gIHJldHVybiBxdWVyeVxuICAgIC5zcGxpdCgnJicpXG4gICAgLm1hcChpdGVtID0+IGl0ZW0uc3BsaXQoJz0nKS5tYXAoZGVjb2RlVVJJQ29tcG9uZW50KSlcbiAgICAucmVkdWNlKHJlZHVjZXIsIHt9KTtcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIFBhcnNlcyBhIHF1ZXJ5IHN0cmluZyBpbnRvIGFuIG9iamVjdC4gS2V5cyB3aXRoIG11bHRpcGxlIGVudHJpZXMgYXJlXG4gKiBjb25kZW5zZWQgaW50byBhbiBBcnJheSB3aXRoIHRoZSB2YWx1ZXMgaW4gdGhlIG9yZGVyIHRoZXkgYXBwZWFyIGluIHRoZSBxdWVyeVxuICogc3RyaW5nLiBBdHRlbXB0cyB0byB1c2UgYnVpbHQtaW5zIGxpa2UgVVJMU2VhcmNoUGFyYW1zIG9yIHRoZSBxcyBsaWJyYXJ5IGluXG4gKiBub2RlLmpzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBxcyBUaGUgcXVlcnkgc3RyaW5nIHRvIHBhcnNlLlxuICogQHJldHVybnMge09iamVjdH0gVGhlIHBhcmFtZXRlciBvYmplY3QuXG4gKi9cbmV4cG9ydCBjb25zdCBwYXJzZVFzID0gKHFzOiBzdHJpbmcpOiBJUG9qbyA9PiB7XG4gIGlmICghcXMpIHJldHVybiB7fTtcbiAgaWYgKHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIFsuLi5uZXcgVVJMU2VhcmNoUGFyYW1zKHFzKV1cbiAgICAgIC5yZWR1Y2UocmVkdWNlciwge30pO1xuICB9XG5cbiAgLy8gRmFsbGJhY2tcbiAgcmV0dXJuIGZhbGxiYWNrKHFzKTtcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIENvbnZlcnRzIGFuIG9iamVjdCBpbnRvIGEgcXVlcnkgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgVGhlIHBhcmFtZXRlcnMgb2JqZWN0LlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIEhUVFAgcXVlcnkgc3RyaW5nLlxuICovXG5leHBvcnQgY29uc3QgY29uc3RydWN0UXMgPSAocGFyYW1zOiBJUG9qbyk6IHN0cmluZyA9PiB7XG4gIGlmICghcGFyYW1zKSByZXR1cm4gJyc7XG4gIHJldHVybiBPYmplY3QuZW50cmllcyhwYXJhbXMpXG4gICAgLmZpbHRlcigoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICBpZiAoIWtleSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSByZXR1cm4gdmFsdWUubGVuZ3RoO1xuICAgICAgcmV0dXJuIHZhbHVlICE9PSAnJyAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkO1xuICAgIH0pXG4gICAgLm1hcCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICBjb25zdCBrID0gZW5jb2RlVVJJQ29tcG9uZW50KGtleSk7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICAgICAgLmZpbHRlcih2MiA9PiB2MiAhPT0gJycgJiYgdjIgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAubWFwKHYyID0+IGAke2t9PSR7ZW5jb2RlVVJJQ29tcG9uZW50KHYyKX1gKVxuICAgICAgICAgIC5qb2luKCcmJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBgJHtrfT0ke2VuY29kZVVSSUNvbXBvbmVudChgJHt2YWx1ZX1gKX1gO1xuICAgIH0pXG4gICAgLmpvaW4oJyYnKTtcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIFRocm93cyBhbiBlcnJvci5cbiAqXG4gKiBAcmV0dXJucyB7dW5kZWZpbmVkfSBOb3RoaW5nLCB0aHJvd3MgYW4gZXJyb3IuXG4gKi9cbmNvbnN0IGVyckZuID0gKCk6IHVuZGVmaW5lZCA9PiB7XG4gIHRocm93IG5ldyBFcnJvcignSGlzdG9yeSBBUEkgb2JqZWN0IG5vdCBwcm92aWRlZCEnKTtcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIEN1c3RvbSBBUEkgZm9yIGludGVyYWN0aW5nIHdpdGggdGhlIGxvY2F0aW9uIGFuZCBoaXN0b3J5XG4gKiBwcm92aWRlZCBieSByZWFjdC1yb3V0ZXItZG9tLlxuICpcbiAqIEBwYXJhbSB7QW55fSBsb2NhdGlvbiBUaGUgY3VycmVudCBuYXZpZ2F0aW9uIGxvY2F0aW9uLlxuICogQHBhcmFtIHtBbnl9IGhpc3RvcnkgVGhlIGhpc3RvcnkgQVBJIG9iamVjdC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBBUEkgb2JqZWN0LlxuICovXG5leHBvcnQgY29uc3QgaGlzdG9yaWNhbCA9IChsb2NhdGlvbjogSUxvY2F0aW9uLCBoaXN0b3J5OiBJSGlzdG9yeSkgPT4gKHtcbiAgY3VycmVudFBhdGg6IGxvY2F0aW9uLnBhdGhuYW1lLFxuICBzZWFyY2hQYXJhbXM6IHBhcnNlUXMobG9jYXRpb24uc2VhcmNoKSxcbiAgY3VycmVudFJvdXRlOiBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaCxcbiAgdXBkYXRlVVJMOiBoaXN0b3J5XG4gICAgPyAodXJsOiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRMb2NhdGlvbiA9IGxvY2F0aW9uLnBhdGhuYW1lICsgbG9jYXRpb24uc2VhcmNoO1xuICAgICAgaWYgKGN1cnJlbnRMb2NhdGlvbiAhPT0gdXJsKSB7XG4gICAgICAgIGhpc3RvcnkucHVzaCh1cmwpO1xuICAgICAgfVxuICAgIH1cbiAgICA6IGVyckZuLFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGhpc3RvcmljYWw7XG4iXX0=