import React from 'react';
import { createStore } from 'redux';
import PropTypes from 'prop-types';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from '../App';
import { Login } from '../Login/Login';
import ProtectedRoute from './ProtectedRoute';
import { ProtectedRouteProps } from './RoutesTypes';
import { RootState } from '../../ducks';

const defaultProtectedRouteProps: ProtectedRouteProps = {
  isAuthenticated: false,
  authenticationPath: '/login',
};

const Root = ({ store }: { store: ReturnType<typeof createStore> }) => (
  <Provider store={store}>
    <Router>
      <Routes />
    </Router>
  </Provider>
);

const Routes: React.FC = () => {
  const isAuthenticated: boolean = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
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
