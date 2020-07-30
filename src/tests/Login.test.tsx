import serializer from 'jest-emotion';

import { Login } from '../views/Login/Login';
import { renderWithTheme } from './helpers';
import React from 'react';
import { styledLogin } from '../views/Login/StyledLogin';
jest.mock('../contexts/auth0-context', () => ({
  useAuth0: jest.fn().mockReturnValue({
    loginWithRedirect: jest.fn(),
    loading: false,
    isAuthenticated: false,
  }),
}));

expect.addSnapshotSerializer(serializer);
test('Login renders correctly', () => {
  const TestLogin = styledLogin(Login as any);
  const button = renderWithTheme(<TestLogin />).toJSON();
  expect(button).toMatchSnapshot();
});
