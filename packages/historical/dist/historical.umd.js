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
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9oaXN0b3JpY2FsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7QUE0QkE7Ozs7OztBQU1BLE1BQU0sUUFBUSxHQUFHLFNBQVgsUUFBVyxDQUFDLElBQUQsRUFBOEI7QUFDN0MsUUFBSSxNQUFNLEdBQUcsSUFBYjs7QUFDQSxRQUFJO0FBQ0YsTUFBQSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLENBQVQ7QUFDRCxLQUZELENBRUUsT0FBTyxFQUFQLEVBQVcsQ0FDWDtBQUNEOztBQUVELFdBQU8sRUFBUDtBQUNELEdBVEQ7QUFXQTs7Ozs7Ozs7Ozs7QUFTQSxNQUFNLE9BQU8sR0FBRyxTQUFWLE9BQVUsQ0FBQyxNQUFELFFBQWlEO0FBQUE7QUFBQSxRQUFoQyxHQUFnQztBQUFBLFFBQTNCLEtBQTJCOztBQUMvRCxRQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsT0FBTixDQUFjLEtBQWQsSUFDUixLQUFLLENBQUMsR0FBTixDQUFVLFFBQVYsQ0FEUSxHQUVSLFFBQVEsQ0FBQyxLQUFELENBRlo7O0FBSUEsUUFBSSxHQUFHLElBQUksTUFBWCxFQUFtQjtBQUNqQixVQUFJLEtBQUssQ0FBQyxPQUFOLENBQWMsTUFBTSxDQUFDLEdBQUQsQ0FBcEIsQ0FBSixFQUFnQztBQUM5QixRQUFBLE1BQU0sQ0FBQyxHQUFELENBQU4sQ0FBWSxJQUFaLENBQWlCLEdBQWpCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsUUFBQSxNQUFNLENBQUMsR0FBRCxDQUFOLEdBQWMsQ0FBQyxNQUFNLENBQUMsR0FBRCxDQUFQLEVBQWMsR0FBZCxDQUFkO0FBQ0Q7QUFDRixLQU5ELE1BTU87QUFDTCxNQUFBLE1BQU0sQ0FBQyxHQUFELENBQU4sR0FBYyxHQUFkO0FBQ0Q7O0FBRUQsV0FBTyxNQUFQO0FBQ0QsR0FoQkQ7QUFrQkE7Ozs7Ozs7Ozs7O0FBU08sTUFBTSxRQUFRLFdBQVIsUUFBUSxHQUFHLFNBQVgsUUFBVyxDQUFDLEVBQUQsRUFBc0I7QUFDNUMsUUFBSSxDQUFDLEVBQUwsRUFBUyxPQUFPLEVBQVA7QUFDVCxRQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBSCxDQUFXLEdBQVgsTUFBb0IsQ0FBcEIsR0FDTixFQUFFLENBQUMsS0FBSCxDQUFTLENBQVQsQ0FETSxHQUVOLEVBRkosQ0FGNEMsQ0FNNUM7O0FBQ0EsUUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxHQUFSLEVBQWEsQ0FBYixDQUFkO0FBRUEsV0FBTyxLQUFLLENBQ1QsS0FESSxDQUNFLEdBREYsRUFFSixHQUZJLENBRUEsVUFBQSxJQUFJO0FBQUEsYUFBSSxJQUFJLENBQUMsS0FBTCxDQUFXLEdBQVgsRUFBZ0IsR0FBaEIsQ0FBb0Isa0JBQXBCLENBQUo7QUFBQSxLQUZKLEVBR0osTUFISSxDQUdHLE9BSEgsRUFHWSxFQUhaLENBQVA7QUFJRCxHQWJNO0FBZVA7Ozs7Ozs7Ozs7O0FBU08sTUFBTSxPQUFPLFdBQVAsT0FBTyxHQUFHLFNBQVYsT0FBVSxDQUFDLEVBQUQsRUFBc0I7QUFDM0MsUUFBSSxDQUFDLEVBQUwsRUFBUyxPQUFPLEVBQVA7O0FBQ1QsUUFBSSxPQUFPLGVBQVAsS0FBMkIsV0FBL0IsRUFBNEM7QUFDMUMsYUFBTyxtQkFBSSxJQUFJLGVBQUosQ0FBb0IsRUFBcEIsQ0FBSixFQUNKLE1BREksQ0FDRyxPQURILEVBQ1ksRUFEWixDQUFQO0FBRUQsS0FMMEMsQ0FPM0M7OztBQUNBLFdBQU8sUUFBUSxDQUFDLEVBQUQsQ0FBZjtBQUNELEdBVE07QUFXUDs7Ozs7Ozs7QUFNTyxNQUFNLFdBQVcsV0FBWCxXQUFXLEdBQUcsU0FBZCxXQUFjLENBQUMsTUFBRCxFQUEwQjtBQUNuRCxRQUFJLENBQUMsTUFBTCxFQUFhLE9BQU8sRUFBUDtBQUNiLFdBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBZSxNQUFmLEVBQ0osTUFESSxDQUNHLGlCQUFpQjtBQUFBO0FBQUEsVUFBZixHQUFlO0FBQUEsVUFBVixLQUFVOztBQUN2QixVQUFJLENBQUMsR0FBTCxFQUFVLE9BQU8sS0FBUDtBQUNWLFVBQUksS0FBSyxDQUFDLE9BQU4sQ0FBYyxLQUFkLENBQUosRUFBMEIsT0FBTyxLQUFLLENBQUMsTUFBYjtBQUMxQixhQUFPLEtBQUssS0FBSyxFQUFWLElBQWdCLEtBQUssS0FBSyxTQUFqQztBQUNELEtBTEksRUFNSixHQU5JLENBTUEsaUJBQWlCO0FBQUE7QUFBQSxVQUFmLEdBQWU7QUFBQSxVQUFWLEtBQVU7O0FBQ3BCLFVBQU0sQ0FBQyxHQUFHLGtCQUFrQixDQUFDLEdBQUQsQ0FBNUI7O0FBQ0EsVUFBSSxLQUFLLENBQUMsT0FBTixDQUFjLEtBQWQsQ0FBSixFQUEwQjtBQUN4QixlQUFPLEtBQUssQ0FDVCxNQURJLENBQ0csVUFBQSxFQUFFO0FBQUEsaUJBQUksRUFBRSxLQUFLLEVBQVAsSUFBYSxFQUFFLEtBQUssU0FBeEI7QUFBQSxTQURMLEVBRUosR0FGSSxDQUVBLFVBQUEsRUFBRTtBQUFBLDJCQUFPLENBQVAsY0FBWSxrQkFBa0IsQ0FBQyxFQUFELENBQTlCO0FBQUEsU0FGRixFQUdKLElBSEksQ0FHQyxHQUhELENBQVA7QUFJRDs7QUFFRCx1QkFBVSxDQUFWLGNBQWUsa0JBQWtCLFdBQUksS0FBSixFQUFqQztBQUNELEtBaEJJLEVBaUJKLElBakJJLENBaUJDLEdBakJELENBQVA7QUFrQkQsR0FwQk07QUFzQlA7Ozs7Ozs7QUFLQSxNQUFNLEtBQUssR0FBRyxTQUFSLEtBQVEsR0FBZ0I7QUFDNUIsVUFBTSxJQUFJLEtBQUosQ0FBVSxrQ0FBVixDQUFOO0FBQ0QsR0FGRDtBQUlBOzs7Ozs7Ozs7O0FBUU8sTUFBTSxVQUFVLFdBQVYsVUFBVSxHQUFHLFNBQWIsVUFBYSxDQUFDLFFBQUQsRUFBc0IsT0FBdEI7QUFBQSxXQUE2QztBQUNyRSxNQUFBLFdBQVcsRUFBRSxRQUFRLENBQUMsUUFEK0M7QUFFckUsTUFBQSxZQUFZLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFWLENBRmdEO0FBR3JFLE1BQUEsWUFBWSxFQUFFLFFBQVEsQ0FBQyxRQUFULEdBQW9CLFFBQVEsQ0FBQyxNQUgwQjtBQUlyRSxNQUFBLFNBQVMsRUFBRSxPQUFPLEdBQ2QsVUFBQyxHQUFELEVBQWdCO0FBQ2hCLFlBQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxRQUFULEdBQW9CLFFBQVEsQ0FBQyxNQUFyRDs7QUFDQSxZQUFJLGVBQWUsS0FBSyxHQUF4QixFQUE2QjtBQUMzQixVQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsR0FBYjtBQUNEO0FBQ0YsT0FOZSxHQU9kO0FBWGlFLEtBQTdDO0FBQUEsR0FBbkI7O3VCQWNRLFUiLCJmaWxlIjoiaGlzdG9yaWNhbC51bWQuanMifQ==