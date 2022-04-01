import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './redux/store'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { Persistor } from './redux/store'

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={Persistor}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);