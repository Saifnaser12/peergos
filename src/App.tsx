import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useUserRole } from './context/UserRoleContext';
import { theme } from './theme';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Assistant from './pages/Assistant';
import Financials from './pages/Financials';
import Setup from './pages/Setup';
import { TransferPricingPage } from './pages/TransferPricingPage';
import { TaxProvider } from './context/TaxContext';
import { RelatedPartyProvider } from './context/RelatedPartyContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

const App: React.FC = () => {
  const { t } = useTranslation();
  const { role } = useUserRole();

  // Check if user is authenticated
  const isAuthenticated = () => {
    const user = localStorage.getItem('user');
    return !!user;
  };

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }
    return <>{children}</>;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TaxProvider>
        <RelatedPartyProvider>
          <I18nextProvider i18n={i18n}>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Routes>
                          <Route index element={<Navigate to="/dashboard" replace />} />
                          <Route path="dashboard" element={<Dashboard />} />
                          <Route path="financials" element={<Financials />} />
                          <Route path="transfer-pricing" element={<TransferPricingPage />} />
                          <Route path="assistant" element={<Assistant />} />
                          <Route path="setup" element={<Setup />} />
                        </Routes>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Router>
          </I18nextProvider>
        </RelatedPartyProvider>
      </TaxProvider>
    </ThemeProvider>
  );
};

export default App;
