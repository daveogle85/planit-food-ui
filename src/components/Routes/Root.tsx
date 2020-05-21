import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createStore } from 'redux';

import Auth0Provider, { useAuth0 } from '../../contexts/auth0-context';
import App from '../App';
import { Login } from '../Login/Login';
import ProtectedRoute from './ProtectedRoute';
import { ProtectedRouteProps } from './RoutesTypes';

const defaultProtectedRouteProps: ProtectedRouteProps = {
  isAuthenticated: false,
  authenticationPath: '/login',
};

const Root = ({ store }: { store: ReturnType<typeof createStore> }) => (
  <Provider store={store}>
    <Auth0Provider>
      <Router>
        <Routes />
      </Router>
    </Auth0Provider>
  </Provider>
);

const Routes: React.FC = () => {
  const { isAuthenticated }: { isAuthenticated: boolean } = useAuth0();
  return (
    <>
      <Switch>
        <ProtectedRoute
          {...defaultProtectedRouteProps}
          isAuthenticated={isAuthenticated}
          exact={true}
          path="/"
          component={App}
        />
        <Route exact path="/login" component={Login} />
        <Route render={() => <div> Sorry, this page does not exist. </div>} />
      </Switch>
    </>
  );
};

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
