import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import './index.css';
import App from './App';
import configureStore from './store';
import { restoreCSRF, csrfFetch } from './store/csrf';

// Creating the store
const store = configureStore();

// If the environment is not production, set the store as a property on the window object to be able to interact with it on the browser console
if(process.env.NODE_ENV !== "production") {
  restoreCSRF()
  
  window.csrfFetch = csrfFetch
  window.store = store;
}

function Root() {
  return (
    <ReduxProvider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ReduxProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);
