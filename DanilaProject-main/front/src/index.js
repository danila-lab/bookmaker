import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import './styles/reset.scss';
import './styles/base.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);