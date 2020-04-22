/**
 * AuthOnlyRoute.js
 *
 * @description Protected route component, requires valid login.
 *
 * @author jarsmith@indot.in.gov
 * @license MIT
 * @copyright INDOT, 2019
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Redirect,
  useLocation,
} from 'react-router-dom';

import {
  RenderProps,
  useRenderProps,
} from '@jasmith79/react-utils';

export type AuthOnlyProps = {
  path: string,
  roles?: string[],
  exact?: boolean,
  render?: () => React.ReactNode,
  user: {
    token?: string,
    roles: string[],
  },
}

/**
 * @description The protected route component.
 *
 * @param {Object} [props] The destructured props object.
 * @param {Function} props.render The render function for the component.
 * @param {Array} props.roles The array of user roles permitted to access the component.
 * @param {Object} props.rest The remaining key/value pairs in props.
 * @returns {Route|Redirect} The desired Route if logged in, else the Login or Forbidden route.
 */
export const AuthOnlyRoute = ({
  roles,
  user,
  path,
  render,
  children,
  component,
}: AuthOnlyProps & RenderProps<{}>) => {
  const loggedIn = Boolean(user && user.token);
  const location = useLocation();
  const renderTarget = useRenderProps({ children, render, component });
  const matchesRole = !roles?.length || roles.some((role: string) => user.roles.includes(role));
  const authorized = Boolean(loggedIn && matchesRole);
  if (loggedIn && authorized) {
    const from = location.pathname + location.search;
    const desiredPage = location.pathname === '/login' ? '/' : from;
    return <Route render={renderTarget} path={desiredPage} />;
  } else {
    return loggedIn
      ? (
        <Route path={path}>
          <Redirect to={{ pathname: '/forbidden', state: { from: location } }} />
        </Route>
      ) : (
        <Route path={path}>
          <Redirect to={{ pathname: '/login', state: { from: location } }} />
        </Route>
      );
  }
};

AuthOnlyRoute.propTypes = {
  path: PropTypes.string.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string),
  render: PropTypes.func,
  user: PropTypes.shape({
    token: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default AuthOnlyRoute;
