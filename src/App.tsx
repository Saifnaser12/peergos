
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VAT from './pages/VAT';
import CIT from './pages/CIT';
import Financials from './pages/Financials';
import TransferPricing from './pages/TransferPricing';
import Assistant from './pages/Assistant';
import Setup from './pages/Setup';

const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  return !!user;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vat"
            element={
              <ProtectedRoute>
                <VAT />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cit"
            element={
              <ProtectedRoute>
                <CIT />
              </ProtectedRoute>
            }
          />
          <Route
            path="/financials"
            element={
              <ProtectedRoute>
                <Financials />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transfer-pricing"
            element={
              <ProtectedRoute>
                <TransferPricing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assistant"
            element={
              <ProtectedRoute>
                <Assistant />
              </ProtectedRoute>
            }
          />
          <Route
            path="/setup"
            element={
              <ProtectedRoute>
                <Setup />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
