import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserRoleProvider } from './context/UserRoleContext';
import { TaxProvider } from './context/TaxContext';
import { AuditProvider } from './context/AuditContext';
import { ThemeProvider } from './context/ThemeContext';
import { RelatedPartyProvider } from './context/RelatedPartyContext';
import { SettingsProvider } from './context/SettingsContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Assistant from './pages/Assistant';
import Admin from './pages/Admin';
import Financials from './pages/Financials';
import Setup from './pages/Setup';
import Filing from './pages/Filing';

const App: React.FC = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <SettingsProvider>
        <ThemeProvider>
          <UserRoleProvider>
            <AuditProvider>
              <TaxProvider>
                <RelatedPartyProvider>
                  <Router>
                    <Layout>
                      <Routes>
                        <Route
                          path="/"
                          element={
                            <ProtectedRoute path="/" resource="dashboard">
                              <Dashboard />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/dashboard"
                          element={
                            <ProtectedRoute path="/dashboard" resource="dashboard">
                              <Dashboard />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/setup"
                          element={
                            <ProtectedRoute path="/setup" resource="setup">
                              <Setup />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/filing"
                          element={
                            <ProtectedRoute path="/filing" resource="filing">
                              <Filing />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/assistant"
                          element={
                            <ProtectedRoute path="/assistant" resource="assistant">
                              <Assistant />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/admin"
                          element={
                            <ProtectedRoute path="/admin" resource="dashboard" requiredPermission="edit">
                              <Admin />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/financials"
                          element={
                            <ProtectedRoute path="/financials" resource="dashboard">
                              <Financials />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="*" element={<Navigate to="/setup" replace />} />
                      </Routes>
                    </Layout>
                  </Router>
                </RelatedPartyProvider>
              </TaxProvider>
            </AuditProvider>
          </UserRoleProvider>
        </ThemeProvider>
      </SettingsProvider>
    </I18nextProvider>
  );
};

export default App;
