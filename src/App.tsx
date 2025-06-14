import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { FinanceProvider } from './context/FinanceContext';
import { UserRoleProvider } from './context/UserRoleContext';
import { NotificationProvider } from './context/NotificationContext';
import { TransferPricingProvider } from './context/TransferPricingContext';
import { TaxProvider } from './context/TaxContext';
import { TaxAgentProvider } from './context/TaxAgentProvider';
import { InvoiceProvider } from './context/InvoiceContext';
import { POSIntegrationProvider } from './context/POSIntegrationContext';
import { RelatedPartyProvider } from './context/RelatedPartyContext';
import { SettingsProvider } from './context/SettingsContext';
import { BalanceSheetProvider } from './context/BalanceSheetContext';
import { WhitelabelProvider } from './context/WhitelabelContext';

// Components
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Dashboard from './pages/Dashboard';
import Accounting from './pages/Accounting';
import VAT from './pages/VAT';
import CIT from './pages/CIT';
import Filing from './pages/Filing';
import Financials from './pages/Financials';
import TransferPricing from './pages/TransferPricing';
import SimpleInvoice from './pages/SimpleInvoice';
import Assistant from './pages/Assistant';
import Calendar from './pages/Calendar';
import TaxWizard from './pages/TaxWizard';
import Admin from './pages/Admin';
import Setup from './pages/Setup';
import Unauthorized from './pages/Unauthorized';
import Login from './pages/Login';
import Register from './pages/Register';
import AssistantTest from './pages/AssistantTest';
import QATest from './pages/QATest';
import Landing from './pages/Landing';
import WhitelabelPage from './pages/WhitelabelPage';
import FreeZoneSubstance from './pages/FreeZoneSubstance';
import FinancialsTest from './components/FinancialsTest';


const App: React.FC = () => {
  const theme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  const [isSetupComplete, setIsSetupComplete] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    try {
      const setupComplete = localStorage.getItem('peergos_setup_complete') === 'true';
      console.log('🔍 Setup status check:', setupComplete);
      console.log('📝 Raw localStorage value:', localStorage.getItem('peergos_setup_complete'));
      setIsSetupComplete(setupComplete);
    } catch (error) {
      console.error('❌ Error checking setup status:', error);
      setIsSetupComplete(false);
    }
  }, []);

  // Show a loading state while checking setup status
  if (isSetupComplete === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
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
                          <InvoiceProvider>
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
                                        <Route index element={
                          isSetupComplete === true ? 
                            <Navigate to="/dashboard" replace /> : 
                            <Navigate to="/setup" replace />
                        } />
                        <Route path="setup" element={<Setup />} />
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
                                        <Route path="calendar" element={
                                          <ProtectedRoute allowedRoles={['admin', 'accountant', 'assistant', 'sme_client']}>
                                            <Calendar />
                                          </ProtectedRoute>
                                        } />
                                          <Route path="tax-wizard" element={
                                            <ProtectedRoute allowedRoles={['admin', 'accountant', 'assistant', 'sme_client']}>
                                              <TaxWizard />
                                            </ProtectedRoute>
                                          } />
                                        <Route path="admin" element={
                                          <ProtectedRoute allowedRoles={['admin']}>
                                            <Admin />
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
                          </InvoiceProvider>
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