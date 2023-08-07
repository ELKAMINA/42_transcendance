import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from "react-router-dom";
import App from './App';
import './index.css';
import { store, persistor } from './app/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { CssBaseline } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode> // I commented the strict mode bc for sockets, useEffect renders two times, when a component mounts. Hence, when i'm conneting to the chat page, i have two clients that connects instead of one which blurry the socket.io working. Link : https://legacy.reactjs.org/docs/strict-mode.html#ensuring-reusable-state. ONLY IN DEVELOPMENT MODE 
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <CssBaseline>
          <App />
        </CssBaseline>
      </Router>
    </PersistGate>
  </Provider>,

  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(//console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
