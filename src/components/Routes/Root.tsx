import { ThemeProvider } from 'emotion-theming';
import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from 'react-router-dom';
import { createStore } from 'redux';

import { Global } from '@emotion/core';
import css from '@emotion/css/macro';

import AddMeal from '../../addMeal/AddMeal';
import Auth0Provider from '../../contexts/auth0-context';
import { globals, theme } from '../../styles/theme';
import WeekView from '../../weekView/WeekView';
import Login from '../Login/Login';
import ProtectedRoute from './ProtectedRoute';
import { ProtectedRouteProps } from './RoutesTypes';
import { CheckAuth } from './CheckAuth';

const CallBack: React.FC = props => {
  let history = useHistory();
  setTimeout(() => history.push('/'));
  return <div>Authorized. Redirecting...</div>;
};

const defaultProtectedRouteProps: ProtectedRouteProps = {
  authenticationPath: '/login',
};

const Root = ({ store }: { store: ReturnType<typeof createStore> }) => (
  <Auth0Provider>
    <Provider store={store}>
      <Global
        styles={css`
          font-family: 'Nunito Sans', sans-serif;
          ${globals}
        `}
      />
      <ThemeProvider theme={theme}>
        <CheckAuth>
          <Router>
            <Routes />
          </Router>
        </CheckAuth>
      </ThemeProvider>
    </Provider>
  </Auth0Provider>
);

const Routes: React.FC = () => {
  return (
    <>
      <Switch>
        <ProtectedRoute
          {...defaultProtectedRouteProps}
          exact={true}
          path="/"
          component={WeekView}
        />
        <ProtectedRoute
          {...defaultProtectedRouteProps}
          exact={true}
          path="/addMeal"
          component={AddMeal}
        />
        <Route path="/callback" component={CallBack} />
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
