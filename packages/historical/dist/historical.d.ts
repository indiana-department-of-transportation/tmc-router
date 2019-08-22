/**
 * index.ts
 *
 * @description Main file for the historical library.
 *
 * @author Jared Smith
 * @license MIT
 */
interface IPojo {
    [key: string]: any;
}
interface ILocation {
    pathname: string;
    search: string;
}
interface IHistory {
    push: (arg: string) => any;
}
/**
 * @description Parses a query string into an object. Keys with multiple entries are
 * condensed into an Array with the values in the order they appear in the query
 * string. This is only used as a fallback in the case that a built-in solution
 * is unavailable.
 *
 * @param {string} qs The query string to parse.
 * @returns {Object} The paramter object.
 */
export declare const fallback: (qs: string) => IPojo;
/**
 * @description Parses a query string into an object. Keys with multiple entries are
 * condensed into an Array with the values in the order they appear in the query
 * string. Attempts to use built-ins like URLSearchParams or the qs library in
 * node.js.
 *
 * @param {string} qs The query string to parse.
 * @returns {Object} The parameter object.
 */
export declare const parseQs: (qs: string) => IPojo;
/**
 * @description Converts an object into a query string.
 *
 * @param {Object} params The parameters object.
 * @returns {string} The HTTP query string.
 */
export declare const constructQs: (params: IPojo) => string;
/**
 * @description Custom API for interacting with the location and history
 * provided by react-router-dom.
 *
 * @param {Any} location The current navigation location.
 * @param {Any} history The history API object.
 * @returns {Object} The API object.
 */
export declare const historical: (location: ILocation, history: IHistory) => {
    currentPath: string;
    searchParams: IPojo;
    currentRoute: string;
    updateURL: (url: string) => void;
};
export default historical;
