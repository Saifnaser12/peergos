import { jsx as _jsx } from "react/jsx-runtime";
// Import polyfills first before anything else
import './polyfills';
// Ensure process is available globally before React imports
if (typeof globalThis !== 'undefined' && typeof globalThis.process === 'undefined') {
    globalThis.process = window.process || { env: {} };
}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';
import { AuditProvider } from './context/AuditContext';
import { AppContextProvider } from './context/AppContext';
const container = document.getElementById('root');
if (!container)
    throw new Error('Root element not found');
const root = createRoot(container);
root.render(_jsx(StrictMode, { children: _jsx(AppContextProvider, { children: _jsx(AuditProvider, { children: _jsx(App, {}) }) }) }));
