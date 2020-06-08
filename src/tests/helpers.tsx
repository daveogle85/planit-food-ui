import React from 'react';
import renderer from 'react-test-renderer';
import { ThemeProvider } from 'emotion-theming';
import { theme } from '../styles/theme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

export function renderWithTheme(component: any, store?: Object) {
  const middlewares: any[] = [];
  const mockStore = configureStore(middlewares);

  return renderer.create(
    <Provider store={mockStore(store ?? {})}>
      <ThemeProvider theme={theme}>{component}</ThemeProvider>
    </Provider>
  );
}

export const mockDate = (currentDate: Date) => {
  global.Date = class extends Date {
    constructor(date: Date) {
      if (date) {
        super(date);
        return this;
      }

      return currentDate;
    }
  } as DateConstructor;
};
