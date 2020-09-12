import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux';
import Routes from 'src/components/Routes';
/**
 * Root component rendered above all others in the app
 */
export default function App(): JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <div>
            <Routes />
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
}
