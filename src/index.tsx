import React from 'react';
import * as serviceWorker from './serviceWorker';
import Root from './components/Routes/Root';
import ReactDOM from 'react-dom';
import store from './store';

// import './index.css';

const render = () => {
  ReactDOM.render(<Root store={store} />, document.getElementById('root'));
};

render();

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./components/Routes/Root', render);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
