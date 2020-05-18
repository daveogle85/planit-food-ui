import { RouteProps } from 'react-router-dom';

export interface ProtectedRouteProps extends RouteProps {
  isAuthenticated: boolean;
  authenticationPath: string;
}
