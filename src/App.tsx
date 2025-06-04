
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/Layout';
import { createTheme } from './theme';

// Import your existing pages
import Dashboard from './pages/Dashboard';
import VAT from './pages/VAT';
import CIT from './pages/CIT';
import Financials from './pages/Financials';
import TransferPricing from './pages/TransferPricing';
import Filing from './pages/Filing';
import Setup from './pages/Setup';
import Assistant from './pages/Assistant';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const theme = createTheme('ltr');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <Layout>
                <Dashboard />
              </Layout>
            } />
            <Route path="/dashboard" element={
              <Layout>
                <Dashboard />
              </Layout>
            } />
            <Route path="/vat" element={
              <Layout>
                <VAT />
              </Layout>
            } />
            <Route path="/cit" element={
              <Layout>
                <CIT />
              </Layout>
            } />
            <Route path="/financials" element={
              <Layout>
                <Financials />
              </Layout>
            } />
            <Route path="/transfer-pricing" element={
              <Layout>
                <TransferPricing />
              </Layout>
            } />
            <Route path="/filing" element={
              <Layout>
                <Filing />
              </Layout>
            } />
            <Route path="/setup" element={
              <Layout>
                <Setup />
              </Layout>
            } />
            <Route path="/assistant" element={
              <Layout>
                <Assistant />
              </Layout>
            } />
          </Routes>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
