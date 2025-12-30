
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
 * Handles origin constraints and preview environment quirks
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Determine the service worker path based on the current environment
    // Use relative path to avoid origin mismatch issues in sandboxed environments
    const swPath = './sw.js';
    
    // Only attempt registration if the environment allows it (same origin)
    // The browser's native register call will check this, we just wrap it in a try-catch
    try {
      navigator.serviceWorker.register(swPath)
        .then(registration => {
          console.log('QuranSeekho SW registered successfully with scope:', registration.scope);
        })
        .catch(error => {
          // Gracefully log instead of crashing for SW registration failures (common in dev environments)
          if (error.name === 'SecurityError') {
            console.warn('SW registration blocked by security policy (likely origin mismatch in dev sandbox). This is normal in some preview environments.');
          } else {
            console.error('QuranSeekho SW registration failed:', error);
          }
        });
    } catch (e) {
      console.warn('Service Worker registration skipped due to environment constraints.', e);
    }
  });
}
