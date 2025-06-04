import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AuditProvider } from './context/AuditContext'
import { UserRoleProvider } from './context/UserRoleContext'
import { AppContextProvider } from './context/AppContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppContextProvider>
      <AuditProvider>
        <UserRoleProvider>
          <App />
        </UserRoleProvider>
      </AuditProvider>
    </AppContextProvider>
  </StrictMode>,
)
