// Load polyfills FIRST - before React or any other imports
import './polyfills';

import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'
import { AuditProvider } from './context/AuditContext'
import { UserRoleProvider } from './context/UserRoleContext'
import { AppContextProvider } from './context/AppContext'

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <AppContextProvider>
      <AuditProvider>
        <UserRoleProvider>
          <App />
        </UserRoleProvider>
      </AuditProvider>
    </AppContextProvider>
  </StrictMode>
)