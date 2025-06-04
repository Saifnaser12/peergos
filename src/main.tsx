
// Import polyfills first before anything else
import './polyfills';

import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'
import { AuditProvider } from './context/AuditContext'
import { UserRoleProvider } from './context/UserRoleContext'
import { AppContextProvider } from './context/AppContext'

const container = document.getElementById('root')
if (!container) throw new Error('Root element not found')

const root = createRoot(container)

root.render(
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
