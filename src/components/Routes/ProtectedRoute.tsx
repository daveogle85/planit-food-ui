import * as React from 'react';
import { Redirect, Route } from 'react-router';
import { ProtectedRouteProps } from './RoutesTypes';

export const ProtectedRoute: React.FC<ProtectedRouteProps> = props => {
  let redirectPath = '';
  if (!props.isAuthenticated) {
    redirectPath = props.authenticationPath;
  }

  if (redirectPath) {
    const renderComponent = () => <Redirect to={{ pathname: redirectPath }} />;
    return <Route {...props} component={renderComponent} render={undefined} />;
  } else {
    return <Route {...props} />;
  }
};

export default ProtectedRoute;
