
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
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
