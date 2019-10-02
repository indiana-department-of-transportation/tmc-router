/**
 * index.ts
 *
 * @description Main file for the historical library.
 *
 * @author Jared Smith
 * @license MIT
 */
interface ILocation {
    pathname: string;
    search: string;
}
interface IHistory {
    push: (arg: string) => any;
}
interface IPojo {
    [key: string]: any;
}
interface IHistorical {
    currentPath: string;
    searchParams: IPojo;
    currentRoute: string;
    updateURL: ((...args: any[]) => void) | ((url: string) => void);
}
/**
 * @description Custom API for interacting with the location and history
 * provided by react-router-dom.
 *
 * @param {Any} location The current navigation location.
 * @param {Any} history The history API object.
 * @returns {Object} The API object.
 */
export declare const historical: (location: ILocation, history?: IHistory | undefined) => IHistorical;
export default historical;
