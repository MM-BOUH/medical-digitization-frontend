import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Feature detection for FormData (should be supported in all modern browsers)
if (typeof FormData === 'undefined') {
  console.error('FormData is not supported in this browser');
}

// Feature detection for fetch API
if (typeof fetch === 'undefined') {
  console.error('Fetch API is not supported in this browser');
}

// Render the application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
