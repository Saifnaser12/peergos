// Import polyfills first before anything else
import './polyfills';

// Ensure critical globals are available
if (typeof globalThis !== 'undefined') {
  if (typeof globalThis.process === 'undefined') {
    globalThis.process = { env: {} };
  }
  if (typeof globalThis.global === 'undefined') {
    globalThis.global = globalThis;
  }
}

import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { libraryLoader } from './utils/libraryLoader';
import './i18n';
import { AuditProvider } from './context/AuditContext';
import { AppContextProvider } from './context/AppContext';

// Initialize libraries asynchronously (non-blocking)
Promise.allSettled([
  libraryLoader.loadJsSHA(),
  libraryLoader.loadQRCode()
]).then(results => {
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.warn(`Library ${index === 0 ? 'jsSHA' : 'QRCode'} failed to load:`, result.reason);
    }
  });
}).catch(console.warn);

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

const root = createRoot(container);

root.render(
  <StrictMode>
    <AppContextProvider>
      <AuditProvider>
        <App />
      </AuditProvider>
    </AppContextProvider>
  </StrictMode>
);