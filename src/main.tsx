import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuditProvider } from './context/AuditContext'
import { UserRoleProvider } from './context/UserRoleContext'
import { AppContextProvider } from './context/AppContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppContextProvider>
      <AuditProvider>
        <UserRoleProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </UserRoleProvider>
      </AuditProvider>
    </AppContextProvider>
  </StrictMode>,
)
