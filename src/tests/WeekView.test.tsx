import serializer from 'jest-emotion';
import React from 'react';

import { styledWeekView } from '../weekView/StyledWeekView';
import WeekView from '../weekView/WeekView';
import { renderWithTheme } from './helpers';
import { RootState } from '../ducks';

jest.mock('../contexts/auth0-context', () => ({
  useAuth0: jest.fn().mockReturnValue({
    loginWithRedirect: jest.fn(),
    loading: false,
    isAuthenticated: false,
    user: {
      picture: '',
    },
  }),
}));

expect.addSnapshotSerializer(serializer);
test('Week View renders correctly', () => {
  const mockStore: RootState = {
    days: {
      loading: false,
      data: [],
      week: [],
    },
    auth: { isAuthenticated: true, token: '' },
  };
  const TestWeekView = styledWeekView(WeekView as any);
  const view = renderWithTheme(<TestWeekView />, mockStore).toJSON();
  expect(view).toMatchSnapshot();
});
