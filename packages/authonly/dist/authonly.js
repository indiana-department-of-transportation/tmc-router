"use strict";
/**
 * AuthOnlyRoute.js
 *
 * @description Protected route component, requires valid login.
 *
 * @author jarsmith@indot.in.gov
 * @license MIT
 * @copyright INDOT, 2019
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const react_router_dom_1 = require("react-router-dom");
/**
  * @description The protected route component.
  *
  * @param {Object} [props] The destructured props object.
  * @param {Any} props.location The location from the router.
  * @returns {Redirect} The Login or Forbidden route.
  */
const NotAuthorized = ({ location, loggedIn, authorized }) => {
    if (!loggedIn) {
        console.log('returning login redirect');
        return react_1.default.createElement(react_router_dom_1.Redirect, { to: { pathname: '/login', state: { from: location } } });
    }
    if (!authorized) {
        return react_1.default.createElement(react_router_dom_1.Redirect, { to: { pathname: '/forbidden', state: { from: location } } });
    }
    throw Error('Invariant violated, NotAuthorized rendered by mistake.');
};
NotAuthorized.propTypes = {
    location: prop_types_1.default.any,
};
/**
 * @description The protected route component.
 *
 * @param {Object} [props] The destructured props object.
 * @param {Function} props.render The render function for the component.
 * @param {Array} props.roles The array of user roles permitted to access the component.
 * @param {Object} props.rest The remaining key/value pairs in props.
 * @returns {Route|Redirect} The desired Route if logged in, else the Login or Forbidden route.
 */
exports.AuthOnlyRoute = ({ render, roles, user, ...rest }) => {
    const loggedIn = Boolean(user && user.token);
    const authorized = Boolean(loggedIn && roles.some((role) => user.roles.includes(role)));
    return (loggedIn && authorized)
        ? (react_1.default.createElement(react_router_dom_1.Route, Object.assign({}, rest, { render: render })))
        : (react_1.default.createElement(react_router_dom_1.Route, Object.assign({}, rest, { render: ({ location }) => react_1.default.createElement(NotAuthorized, { location: location, loggedIn: loggedIn, authorized: authorized }) })));
};
exports.AuthOnlyRoute.propTypes = {
    roles: prop_types_1.default.arrayOf(prop_types_1.default.string.isRequired).isRequired,
    render: prop_types_1.default.func.isRequired,
    user: prop_types_1.default.shape({
        token: prop_types_1.default.string,
        roles: prop_types_1.default.arrayOf(prop_types_1.default.string.isRequired).isRequired,
    }).isRequired,
};
exports.default = exports.AuthOnlyRoute;
//# sourceMappingURL=authonly.js.map