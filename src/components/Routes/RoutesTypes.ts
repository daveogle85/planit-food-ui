import { RouteProps } from 'react-router-dom';

export interface ProtectedRouteProps extends RouteProps {
  authenticationPath: string;
}
