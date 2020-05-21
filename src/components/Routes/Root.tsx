import { ThemeProvider } from 'emotion-theming';
import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createStore } from 'redux';

import { Global } from '@emotion/core';
import css from '@emotion/css/macro';

import Auth0Provider, { useAuth0 } from '../../contexts/auth0-context';
import { theme, globals } from '../../styles/theme';
import App from '../App';
import Login from '../Login/StyledLogin';
import ProtectedRoute from './ProtectedRoute';
import { ProtectedRouteProps } from './RoutesTypes';

const defaultProtectedRouteProps: ProtectedRouteProps = {
  isAuthenticated: false,
  authenticationPath: '/login',
};

const Root = ({ store }: { store: ReturnType<typeof createStore> }) => (
  <Provider store={store}>
    <Global
      styles={css`
        font-family: 'Nunito Sans', sans-serif;
        ${globals}
      `}
    />
    <ThemeProvider theme={theme}>
      <Auth0Provider>
        <Router>
          <Routes />
        </Router>
      </Auth0Provider>
    </ThemeProvider>
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
