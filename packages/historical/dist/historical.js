"use strict";
/**
 * index.ts
 *
 * @description Main file for the historical library.
 *
 * @author Jared Smith
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const qs_1 = require("@indot/qs");
/**
 * @description Throws an error.
 *
 * @returns {undefined} Nothing, throws an error.
 */
const errFn = () => {
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
exports.historical = (location, history) => ({
    currentPath: location.pathname,
    searchParams: qs_1.parseQs(location.search),
    currentRoute: location.pathname + location.search,
    updateURL: history
        ? (url) => {
            const currentLocation = location.pathname + location.search;
            if (currentLocation !== url) {
                history.push(url);
            }
        }
        : errFn,
});
exports.default = exports.historical;
//# sourceMappingURL=historical.js.map