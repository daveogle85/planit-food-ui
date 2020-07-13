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

import Auth0Provider from '../../contexts/auth0-context';
import { globals, theme } from '../../styles/theme';
import AddMeal from '../../views/addMeal/AddMeal';
import WeekView from '../../views/weekView/WeekView';
import Login from '../Login/Login';
import Toast from '../Toast/Toast';
import { CheckAuth } from './CheckAuth';
import ProtectedRoute from './ProtectedRoute';
import { ProtectedRouteProps } from './RoutesTypes';
import Calendar from '../../views/calendar/Calendar';
import { ModalProvider } from 'styled-react-modal';

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
        <ModalProvider>
          <CheckAuth>
            <Router>
              <Routes />
            </Router>
            <Toast />
          </CheckAuth>
        </ModalProvider>
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
        <ProtectedRoute
          {...defaultProtectedRouteProps}
          exact={true}
          path="/calendar"
          component={Calendar}
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
