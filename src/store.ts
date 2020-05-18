import { configureStore } from '@reduxjs/toolkit';

import rootReducer from './ducks/index';

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./ducks/index', () => {
    const newRootReducer = require('./ducks/index').default;
    store.replaceReducer(newRootReducer);
  });
}

export type AppDispatch = typeof store.dispatch;

export default store;
