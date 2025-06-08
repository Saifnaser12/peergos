import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Spinner from './components/Spinner';

// Pages
import Home from './pages/Home';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Filing from './pages/Filing';
import VAT from './pages/VAT';
import CIT from './pages/CIT';
import TransferPricing from './pages/TransferPricing';
import Accounting from './pages/Accounting';
import Financials from './pages/Financials';
import Calendar from './pages/Calendar';
import Assistant from './pages/Assistant';
import Setup from './pages/Setup';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import QATest from './pages/QATest';
import BackupManager from './pages/BackupManager'; // Assuming BackupManager.js exists
import QAChecklist from './components/QAChecklist';
import WhitelabelPage from './pages/WhitelabelPage';
import Setup from './pages/Setup';
import Unauthorized from './pages/Unauthorized';
import AssistantTest from './pages/AssistantTest'; // Import the AssistantTest component

// Context
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import { UserRoleProvider } from './context/UserRoleContext';
import { TaxProvider } from './context/TaxContext';
import { NotificationProvider } from './context/NotificationContext';
import { SettingsProvider } from './context/SettingsContext';
import { WhitelabelProvider } from './context/WhitelabelContext';
import { FinanceProvider } from './context/FinanceContext';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CustomThemeProvider>
          <SettingsProvider>
            <WhitelabelProvider>
              <UserRoleProvider>
                <TaxProvider>
                  <NotificationProvider>
                    <FinanceProvider>
                      <Router>
                        <div className="App" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                          <Suspense fallback={<Spinner />}>
                            <Routes>
                              <Route path="/" element={<Landing />} />
                              <Route path="/home" element={<Layout><Home /></Layout>} />
                              <Route path="/login" element={<Login />} />
                              <Route path="/register" element={<Register />} />
                              <Route path="/setup" element={<Setup />} />
                              <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                              <Route path="/filing" element={<Layout><Filing /></Layout>} />
                              <Route path="/vat" element={<Layout><VAT /></Layout>} />
                              <Route path="/cit" element={<Layout><CIT /></Layout>} />
                              <Route path="/transfer-pricing" element={<Layout><TransferPricing /></Layout>} />
                              <Route path="/accounting" element={<Layout><Accounting /></Layout>} />
                              <Route path="/financials" element={<Layout><Financials /></Layout>} />
                              <Route path="/calendar" element={<Layout><Calendar /></Layout>} />
                              <Route path="/assistant" element={<Layout><Assistant /></Layout>} />
                              <Route path="/admin" element={<Layout><Admin /></Layout>} />
                              <Route path="/qa-test" element={<Layout><QATest /></Layout>} />
                              <Route path="/assistant-test" element={<Layout><AssistantTest /></Layout>} />
                              <Route path="/backup" element={<Layout><BackupManager /></Layout>} />
                              <Route path="/whitelabel" element={<Layout><WhitelabelPage /></Layout>} />
                              <Route path="*" element={<Navigate to="/home" replace />} />
                            </Routes>
                          </Suspense>
                        </div>
                      </Router>
                    </FinanceProvider>
                  </NotificationProvider>
                </TaxProvider>
              </UserRoleProvider>
            </WhitelabelProvider>
          </SettingsProvider>
        </CustomThemeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;