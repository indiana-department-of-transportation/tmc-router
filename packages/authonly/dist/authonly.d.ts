/**
 * AuthOnlyRoute.js
 *
 * @description Protected route component, requires valid login.
 *
 * @author jarsmith@indot.in.gov
 * @license MIT
 * @copyright INDOT, 2019
 */
import { ReactNode, SFC } from 'react';
import { RouteComponentProps } from 'react-router-dom';
export interface AuthOnlyProps {
    render: (props: RouteComponentProps<any>) => ReactNode | undefined;
    roles: string[];
    path: string;
    exact: boolean;
    user: {
        token?: string | null;
        roles: string[];
    };
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
export declare const AuthOnlyRoute: SFC<AuthOnlyProps>;
export default AuthOnlyRoute;
