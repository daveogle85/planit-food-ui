import * as React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router';

import { RootState } from '../../ducks';
import { ProtectedRouteProps } from './RoutesTypes';

export const ProtectedRoute: React.FC<ProtectedRouteProps> = props => {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  let redirectPath = '';
  if (!isAuthenticated) {
    redirectPath = props.authenticationPath;
  }

  if (redirectPath) {
    const renderComponent = () => <Redirect to={{ pathname: redirectPath }} />;
    return <Route {...props} component={renderComponent} />;
  } else {
    return <Route {...props} />;
  }
};

export default ProtectedRoute;
