import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
import { ThemeProvider } from './context/ThemeContext';
import { TaxProvider } from './context/TaxProvider';
import { UserRoleProvider } from './context/UserRoleContext';
import { NotificationProvider } from './context/NotificationContext';
import { TransferPricingProvider } from './context/TransferPricingProvider';
import ErrorBoundary from './components/ErrorBoundary';
import AppLayout from './components/AppLayout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Filing from './pages/Filing';
import Accounting from './pages/Accounting';
import VAT from './pages/VAT';
import CIT from './pages/CIT';
import TransferPricing from './pages/TransferPricing';
import Financials from './pages/Financials';
import Setup from './pages/Setup';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Calendar from './pages/Calendar';
import SimpleInvoice from './pages/SimpleInvoice';
import Assistant from './pages/Assistant';
import FreeZoneSubstance from './pages/FreeZoneSubstance';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';

// Context Providers
import { FinanceProvider } from './context/FinanceContext';
import { TaxAgentProvider } from './context/TaxAgentContext';
import { POSIntegrationProvider } from './context/POSIntegrationContext';
import { RelatedPartyProvider } from './context/RelatedPartyContext';
import { SettingsProvider } from './context/SettingsContext';
import { BalanceSheetProvider } from './context/BalanceSheetContext';
import { WhitelabelProvider } from './context/WhitelabelProvider';

// Components
import Layout from './components/Layout';

// Pages
import AssistantTest from './pages/AssistantTest';
import QATest from './pages/QATest';
import Landing from './pages/Landing';
import WhitelabelPage from './pages/WhitelabelPage';
import FinancialsTest from './components/FinancialsTest';
import './index.css';

const App: React.FC = () => {
  const { i18n, ready } = useTranslation();

  useEffect(() => {
    // Ensure proper direction is set
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const theme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <WhitelabelProvider>
          <ThemeProvider>
            <UserRoleProvider>
              <NotificationProvider>
                <SettingsProvider>
                  <TaxAgentProvider>
                    <POSIntegrationProvider>
                      <FinanceProvider>
                        <TaxProvider>
                            <TransferPricingProvider>
                              <RelatedPartyProvider>
                                <BalanceSheetProvider>
                                  <Router>
                                    <Routes>
                                      {/* Public routes */}
                                      <Route path="/login" element={<Login />} />
                                      <Route path="/register" element={<Register />} />
                                      <Route path="/landing" element={<Landing />} />
                                      <Route path="/unauthorized" element={<Unauthorized />} />

                                      {/* Protected routes with layout */}
                                      <Route path="/" element={<Layout />}>
                                        <Route index element={<Navigate to="/dashboard" replace />} />
                                        <Route path="dashboard" element={
                                          <ProtectedRoute allowedRoles={['admin', 'accountant', 'assistant', 'sme_client']}>
                                            <Dashboard />
                                          </ProtectedRoute>
                                        } />
                                        <Route path="accounting" element={
                                          <ProtectedRoute allowedRoles={['admin', 'accountant']}>
                                            <Accounting />
                                          </ProtectedRoute>
                                        } />
                                        <Route path="vat" element={
                                          <ProtectedRoute allowedRoles={['admin', 'accountant']}>
                                            <VAT />
                                          </ProtectedRoute>
                                        } />
                                        <Route path="cit" element={
                                          <ProtectedRoute allowedRoles={['admin', 'accountant']}>
                                            <CIT />
                                          </ProtectedRoute>
                                        } />
                                        <Route path="filing" element={
                                          <ProtectedRoute allowedRoles={['admin', 'accountant']}>
                                            <Filing />
                                          </ProtectedRoute>
                                        } />
                                        <Route path="financials" element={
                                          <ProtectedRoute allowedRoles={['admin', 'accountant', 'assistant']}>
                                            <ErrorBoundary>
                                              <Financials />
                                            </ErrorBoundary>
                                          </ProtectedRoute>
                                        } />
                                        <Route path="transfer-pricing" element={
                                          <ProtectedRoute allowedRoles={['admin', 'accountant']}>
                                            <TransferPricing />
                                          </ProtectedRoute>
                                        } />
                                        <Route path="simple-invoice" element={
                                          <ProtectedRoute allowedRoles={['admin', 'accountant', 'assistant']}>
                                            <SimpleInvoice />
                                          </ProtectedRoute>
                                        } />
                                        <Route path="assistant" element={
                                          <ProtectedRoute allowedRoles={['admin', 'accountant', 'assistant', 'sme_client']}>
                                            <Assistant />
                                          </ProtectedRoute>
                                        } />
                                        <Route path="admin" element={
                                          <ProtectedRoute allowedRoles={['admin']}>
                                            <Admin />
                                          </ProtectedRoute>
                                        } />
                                        <Route path="calendar" element={
                                          <ProtectedRoute allowedRoles={['admin', 'accountant', 'assistant', 'sme_client']}>
                                            <Calendar />
                                          </ProtectedRoute>
                                        } />
                                        <Route path="setup" element={
                                          <ProtectedRoute allowedRoles={['admin', 'accountant']}>
                                            <Setup />
                                          </ProtectedRoute>
                                        } />
                                        <Route path="assistant-test" element={
                                          <ProtectedRoute allowedRoles={['admin']}>
                                            <AssistantTest />
                                          </ProtectedRoute>
                                        } />
                                        <Route path="qa-test" element={
                                          <ProtectedRoute allowedRoles={['admin']}>
                                            <QATest />
                                          </ProtectedRoute>
                                        } />
                                        <Route path="whitelabel" element={
                                          <ProtectedRoute allowedRoles={['admin']}>
                                            <WhitelabelPage />
                                          </ProtectedRoute>
                                        } />
                                        <Route path="freezone-substance" element={
                                          <ProtectedRoute allowedRoles={['admin', 'accountant']}>
                                            <FreeZoneSubstance />
                                          </ProtectedRoute>
                                        } />
                                          <Route path="financials-test" element={<FinancialsTest />} />
                                      </Route>
                                    </Routes>
                                  </Router>
                                </BalanceSheetProvider>
                              </RelatedPartyProvider>
                            </TransferPricingProvider>
                        </TaxProvider>
                      </FinanceProvider>
                    </POSIntegrationProvider>
                  </TaxAgentProvider>
                </SettingsProvider>
              </NotificationProvider>
            </UserRoleProvider>
          </ThemeProvider>
        </WhitelabelProvider>
      </MuiThemeProvider>
    </ErrorBoundary>
  );
};

export default App;