/**
 * AuthOnlyRoute.js
 *
 * @description Protected route component, requires valid login.
 *
 * @author jarsmith@indot.in.gov
 * @license MIT
 * @copyright INDOT, 2019
 */

import React, { ReactNode, SFC } from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Redirect,
  RouteComponentProps,
} from 'react-router-dom';

export interface AuthOnlyProps {
  render: (props: RouteComponentProps<any>) => ReactNode | undefined,
  roles: string[],
  path: string,
  exact: boolean,
  user: {
    token?: string | null,
    roles: string[],
  },
}

/**
  * @description The protected route component.
  *
  * @param {Object} [props] The destructured props object.
  * @param {Any} props.location The location from the router.
  * @returns {Redirect} The Login or Forbidden route.
  */
const NotAuthorized = ({
  location,
  loggedIn,
  authorized
}: {
  location: any,
  loggedIn: boolean,
  authorized: boolean,
}) => {
  if (!loggedIn) {
    console.log('returning login redirect');
    return <Redirect to={{ pathname: '/login', state: { from: location } }} />;
  }

  if (!authorized) {
    return <Redirect to={{ pathname: '/forbidden', state: { from: location } }} />;
  }

  throw Error('Invariant violated, NotAuthorized rendered by mistake.');
};

NotAuthorized.propTypes = {
  location: PropTypes.any,
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
export const AuthOnlyRoute: SFC<AuthOnlyProps> = ({
  render,
  roles,
  user,
  ...rest
}) => {
  const loggedIn = Boolean(user && user.token);
  const authorized = Boolean(loggedIn && roles.some((role: string) => user.roles.includes(role)));

  return (loggedIn && authorized)
    ? (
      <Route
        {...rest}
        render={render}
      />
    )
    : (
      <Route
        {...rest}
        render={({ location }) => <NotAuthorized location={location} loggedIn={loggedIn} authorized={authorized} />}
      />
    );
};

AuthOnlyRoute.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  render: PropTypes.func.isRequired,
  user: PropTypes.shape({
    token: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  }).isRequired,
};

export default AuthOnlyRoute;
