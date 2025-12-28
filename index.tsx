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
 * Register Service Worker for PWA
 * We add extra checks to handle development environments like AI Studio 
 * where Service Workers might be blocked due to origin restrictions.
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Only attempt registration if we are on a secure context and not in a restricted frame
    // In production, this works normally. In AI Studio, we catch and log a friendlier message.
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('QuranSeekho: Service Worker registered successfully');
      })
      .catch((err) => {
        // If the error is about Origin or Security, we log a more helpful message
        if (err.message.includes('origin') || err.message.includes('SecurityError')) {
          console.warn('QuranSeekho: Service Worker registration skipped (expected in preview environment). This will work normally on your production domain.');
        } else {
          console.error('QuranSeekho: Service Worker registration failed:', err);
        }
      });
  });
}