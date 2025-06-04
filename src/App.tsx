import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ErrorBoundary } from './components/ErrorBoundary';
import AppLayout from './components/AppLayout';
import { createTheme } from './theme';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import { TaxProvider } from './context/TaxContext';
import { UserRoleProvider } from './context/UserRoleContext';
import { SettingsProvider } from './context/SettingsContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { NotificationProvider } from './context/NotificationContext';

// Import your existing pages
import Setup from './pages/Setup';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import VAT from './pages/VAT';
import CIT from './pages/CIT';
import Financials from './pages/Financials';
import TransferPricing from './pages/TransferPricing';
import Filing from './pages/Filing';
import Assistant from './pages/Assistant';


function App() {
  const theme = createTheme('ltr');
  const [isSetupComplete, setIsSetupComplete] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if setup is complete
    const setupComplete = localStorage.getItem('peergos_setup_complete') === 'true';
    setIsSetupComplete(setupComplete);
  }, []);

  // Show loading while checking setup status
  if (isSetupComplete === null) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      <SettingsProvider>
        <CustomThemeProvider>
          <TaxProvider>
            <NotificationProvider>
              <UserRoleProvider>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <ErrorBoundary>
                    <Router>
                      <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Setup route - accessible without layout */}
                        <Route path="/setup" element={<Setup />} />

                        {/* Protected routes with layout */}
                        <Route path="/" element={
                          isSetupComplete ? (
                            <AppLayout />
                          ) : (
                            <Navigate to="/setup" replace />
                          )
                        }>
                          {/* Nested routes that will render in the Outlet */}
                          <Route index element={<Navigate to="/dashboard" replace />} />
                          <Route path="dashboard" element={<Dashboard />} />
                          <Route path="vat" element={<VAT />} />
                          <Route path="cit" element={<CIT />} />
                          <Route path="financials" element={<Financials />} />
                          <Route path="transfer-pricing" element={<TransferPricing />} />
                          <Route path="filing" element={<Filing />} />
                          <Route path="assistant" element={<Assistant />} />
                        </Route>

                        {/* Catch all route */}
                        <Route path="*" element={
                          isSetupComplete ? (
                            <Navigate to="/dashboard" replace />
                          ) : (
                            <Navigate to="/setup" replace />
                          )
                        } />
                      </Routes>
                    </Router>
                  </ErrorBoundary>
                </ThemeProvider>
              </UserRoleProvider>
            </NotificationProvider>
          </TaxProvider>
        </CustomThemeProvider>
      </SettingsProvider>
    </I18nextProvider>
  );
}

export default App;