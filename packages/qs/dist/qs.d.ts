/**
 * qs.ts
 *
 * @description Parses query strings into and creates them from Javascript objects.
 *
 * @author Jared Smith
 * @license MIT
 */
import { IPojo } from '@jasmith79/ts-utils';
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
