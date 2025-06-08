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
import { TaxAgentProvider } from './context/TaxAgentContext';
import { POSIntegrationProvider } from './context/POSIntegrationContext';
import { FinanceProvider } from './context/FinanceContext';

// Import your existing pages
import Setup from './pages/Setup';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import VAT from './pages/VAT';
import Accounting from './pages/Accounting';
import CIT from './pages/CIT';
import Financials from './pages/Financials';
import TransferPricingPage from './pages/TransferPricingPage';
import TransferPricing from './pages/TransferPricing';
import Calendar from './pages/Calendar';
import Assistant from './pages/Assistant';
import SimpleInvoice from './pages/SimpleInvoice';
import Filing from './pages/Filing';
import QAChecklist from './components/QAChecklist';

// Internal component to handle theme with i18n
function AppContent() {
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
  const theme = createTheme(direction);

  const [isSetupComplete, setIsSetupComplete] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      // Check if setup is complete
      const setupComplete = localStorage.getItem('peergos_setup_complete') === 'true';
      setIsSetupComplete(setupComplete);
    } catch (error) {
      console.error('Error checking setup status:', error);
      setIsSetupComplete(false);
    }
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

              <Route path="dashboard" element={
                <ProtectedRoute rolesAllowed={["admin", "accountant", "assistant", "viewer"]}>
                  <Dashboard />
                </ProtectedRoute>
              } />

              <Route path="vat" element={
                <ProtectedRoute rolesAllowed={["admin", "accountant"]}>
                  <VAT />
                </ProtectedRoute>
              } />

              <Route path="accounting" element={
                <ProtectedRoute rolesAllowed={["admin", "accountant", "assistant"]}>
                  <Accounting />
                </ProtectedRoute>
              } />

              <Route path="cit" element={
                <ProtectedRoute rolesAllowed={["admin", "accountant", "assistant"]}>
                  <CIT />
                </ProtectedRoute>
              } />

              <Route path="financials" element={
                <ProtectedRoute rolesAllowed={["admin", "accountant"]}>
                  <Financials />
                </ProtectedRoute>
              } />

              <Route path="transfer-pricing" element={
                <ProtectedRoute rolesAllowed={["admin", "accountant", "assistant", "viewer"]}>
                  <TransferPricing />
                </ProtectedRoute>
              } />
              <Route path="/qa-checklist" element={
                <ProtectedRoute rolesAllowed={['admin']}>
                  <QAChecklist />
                </ProtectedRoute>
              } />

              <Route path="filing" element={
                <ProtectedRoute rolesAllowed={["admin", "accountant", "assistant"]}>
                  <Filing />
                </ProtectedRoute>
              } />

              <Route path="assistant" element={
                <ProtectedRoute rolesAllowed={["admin", "accountant", "assistant"]}>
                  <Assistant />
                </ProtectedRoute>
              } />

              <Route path="calendar" element={
                <ProtectedRoute rolesAllowed={["admin", "accountant", "assistant", "viewer"]}>
                  <Calendar />
                </ProtectedRoute>
              } />

              <Route path="simple-invoice" element={
                <ProtectedRoute rolesAllowed={["admin", "accountant", "assistant"]}>
                  <SimpleInvoice />
                </ProtectedRoute>
              } />

              <Route path="unauthorized" element={<Unauthorized />} />
            </Route>
          </Routes>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}


function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <SettingsProvider>
        <FinanceProvider>
          <CustomThemeProvider>
            <TaxProvider>
              <UserRoleProvider>
                <NotificationProvider>
                  <TaxAgentProvider>
                    <POSIntegrationProvider>
                      <AppContent />
                    </POSIntegrationProvider>
                  </TaxAgentProvider>
                </NotificationProvider>
              </UserRoleProvider>
            </TaxProvider>
          </CustomThemeProvider>
        </FinanceProvider>
      </SettingsProvider>
    </I18nextProvider>
  );
}

export default App;