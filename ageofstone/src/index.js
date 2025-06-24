import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { RootStoreProvider } from "./stores/RootStore";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <RootStoreProvider>
          <App />
      </RootStoreProvider>
  </React.StrictMode>
);
