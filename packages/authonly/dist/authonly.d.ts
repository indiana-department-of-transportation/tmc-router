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
import { RenderProps } from '@jasmith79/react-utils';
export declare type AuthOnlyProps = {
    path: string;
    roles?: string[];
    exact?: boolean;
    render?: () => React.ReactNode;
    user: {
        token?: string;
        roles: string[];
    };
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
export declare const AuthOnlyRoute: {
    ({ roles, user, path, render, children, component, }: AuthOnlyProps & RenderProps<{}>): JSX.Element;
    propTypes: {
        path: PropTypes.Validator<string>;
        roles: PropTypes.Requireable<(string | null | undefined)[]>;
        render: PropTypes.Requireable<(...args: any[]) => any>;
        user: PropTypes.Validator<PropTypes.InferProps<{
            token: PropTypes.Requireable<string>;
            roles: PropTypes.Requireable<(string | null | undefined)[]>;
        }>>;
    };
};
export default AuthOnlyRoute;
