import React from "react";
import renderer from "react-test-renderer";
import { ThemeProvider } from "emotion-theming";
import { theme } from "../styles/theme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { FeedbackStatus, ErrorState } from "../ducks/toast/ToastTypes";
import { setPopped } from "../ducks/toast/ToastReducer";
import { Dispatch } from "@reduxjs/toolkit";

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

export const mockPopToastPayload = {
  status: FeedbackStatus.WARN,
  message: "test",
};

export async function dispatchWithTimeout(dispatch: Dispatch, action: any) {
  await dispatch(action);
  jest.advanceTimersByTime(5000);
}

export function mockSetToastState(toastState: ErrorState) {
  return {
    payload: toastState,
    type: "toast/setToastState",
  };
}

export function mockPopToastActions(toastState: ErrorState) {
  return [setPopped(true), mockSetToastState(toastState), setPopped(false)];
}
