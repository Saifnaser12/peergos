import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Setup from './pages/Setup'
import Filing from './pages/Filing'
import Dashboard from './pages/Dashboard'
import Assistant from './pages/Assistant'
import { TaxProvider } from './context/TaxContext'
import { UserRoleProvider } from './context/UserRoleContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <TaxProvider>
      <UserRoleProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route 
                path="/" 
                element={
                  <ProtectedRoute path="/">
                    <Home />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/setup" 
                element={
                  <ProtectedRoute path="/setup">
                    <Setup />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/filing" 
                element={
                  <ProtectedRoute path="/filing">
                    <Filing />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute path="/dashboard">
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/assistant" 
                element={
                  <ProtectedRoute path="/assistant">
                    <Assistant />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </Router>
      </UserRoleProvider>
    </TaxProvider>
  )
}

export default App
