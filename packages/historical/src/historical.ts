/**
 * index.ts
 * 
 * @description Main file for the historical library.
 * 
 * @author Jared Smith
 * @license MIT
 */

import { parseQs } from '@indot/qs';

interface ILocation {
  pathname: string,
  search: string,
}

interface IHistory {
  push: (arg: string) => any,
}

interface IPojo {
  [key: string]: any
}

interface IHistorical {
  currentPath: string,
  searchParams: IPojo,
  currentRoute: string,
  updateURL: ((...args: any[]) => void) | ((url: string) => void),
}

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
export const historical = (location: ILocation, history?: IHistory): IHistorical => ({
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
