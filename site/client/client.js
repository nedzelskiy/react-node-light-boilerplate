/* eslint-disable no-console */
import React from 'react';
import { Provider } from 'react-redux';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import configureStore from './configureStore';

const { store } = configureStore(window.state);
document.body.removeChild(document.getElementById('state'));

hydrate(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('app'),
);
