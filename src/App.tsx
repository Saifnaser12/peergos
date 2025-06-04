import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Filing from './pages/Filing';
import CIT from './pages/CIT';
import VAT from './pages/VAT';
import TransferPricing from './pages/TransferPricing';
import Financials from './pages/Financials';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import Setup from './pages/Setup';
import createTheme from './theme';
import './i18n';

function App() {
  const theme = createTheme('ltr');
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/filing" element={<Filing />} />
              <Route path="/cit" element={<CIT />} />
              <Route path="/vat" element={<VAT />} />
              <Route path="/transfer-pricing" element={<TransferPricing />} />
              <Route path="/financials" element={<Financials />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/setup" element={<Setup />} />
            </Routes>
          </Layout>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;