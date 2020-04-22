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
const react_utils_1 = require("@jasmith79/react-utils");
/**
 * @description The protected route component.
 *
 * @param {Object} [props] The destructured props object.
 * @param {Function} props.render The render function for the component.
 * @param {Array} props.roles The array of user roles permitted to access the component.
 * @param {Object} props.rest The remaining key/value pairs in props.
 * @returns {Route|Redirect} The desired Route if logged in, else the Login or Forbidden route.
 */
exports.AuthOnlyRoute = ({ roles, user, path, render, children, component, }) => {
    const loggedIn = Boolean(user && user.token);
    const location = react_router_dom_1.useLocation();
    const renderTarget = react_utils_1.useRenderProps({ children, render, component });
    const matchesRole = !(roles === null || roles === void 0 ? void 0 : roles.length) || roles.some((role) => user.roles.includes(role));
    const authorized = Boolean(loggedIn && matchesRole);
    if (loggedIn && authorized) {
        const from = location.pathname + location.search;
        const desiredPage = location.pathname === '/login' ? '/' : from;
        return react_1.default.createElement(react_router_dom_1.Route, { render: renderTarget, path: desiredPage });
    }
    else {
        return loggedIn
            ? (react_1.default.createElement(react_router_dom_1.Route, { path: path },
                react_1.default.createElement(react_router_dom_1.Redirect, { to: { pathname: '/forbidden', state: { from: location } } }))) : (react_1.default.createElement(react_router_dom_1.Route, { path: path },
            react_1.default.createElement(react_router_dom_1.Redirect, { to: { pathname: '/login', state: { from: location } } })));
    }
};
exports.AuthOnlyRoute.propTypes = {
    path: prop_types_1.default.string.isRequired,
    roles: prop_types_1.default.arrayOf(prop_types_1.default.string),
    render: prop_types_1.default.func,
    user: prop_types_1.default.shape({
        token: prop_types_1.default.string,
        roles: prop_types_1.default.arrayOf(prop_types_1.default.string),
    }).isRequired,
};
exports.default = exports.AuthOnlyRoute;
//# sourceMappingURL=authonly.js.map