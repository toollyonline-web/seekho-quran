
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * Service Worker Registration
 * Registering from root /sw.js to ensure full scope control
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('QuranSeekho SW registered successfully with scope:', registration.scope);
      })
      .catch(error => {
        console.error('QuranSeekho SW registration failed:', error);
      });
  });
}
