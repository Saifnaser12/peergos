import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
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
import TransferPricing from './pages/TransferPricing';
import Calendar from './pages/Calendar';
import Assistant from './pages/Assistant';
import SimpleInvoice from './pages/SimpleInvoice';
import Filing from './pages/Filing';
import QAChecklist from './components/QAChecklist';
import QATest from './pages/QATest';
// Internal component to handle theme with i18n
function AppContent() {
    const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
    const theme = createTheme(direction);
    const [isSetupComplete, setIsSetupComplete] = useState(null);
    useEffect(() => {
        try {
            // Check if setup is complete
            const setupComplete = localStorage.getItem('peergos_setup_complete') === 'true';
            setIsSetupComplete(setupComplete);
        }
        catch (error) {
            console.error('Error checking setup status:', error);
            setIsSetupComplete(false);
        }
    }, []);
    // Show loading while checking setup status
    if (isSetupComplete === null) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" }) }));
    }
    return (_jsxs(ThemeProvider, { theme: theme, children: [_jsx(CssBaseline, {}), _jsx(ErrorBoundary, { children: _jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/setup", element: _jsx(Setup, {}) }), _jsxs(Route, { path: "/", element: isSetupComplete ? (_jsx(AppLayout, {})) : (_jsx(Navigate, { to: "/setup", replace: true })), children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "dashboard", element: _jsx(ProtectedRoute, { rolesAllowed: ["admin", "accountant", "assistant", "sme_client"], children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "vat", element: _jsx(ProtectedRoute, { rolesAllowed: ["admin", "accountant"], children: _jsx(VAT, {}) }) }), _jsx(Route, { path: "accounting", element: _jsx(ProtectedRoute, { rolesAllowed: ["admin", "sme_client"], children: _jsx(Accounting, {}) }) }), _jsx(Route, { path: "cit", element: _jsx(ProtectedRoute, { rolesAllowed: ["admin", "accountant"], children: _jsx(CIT, {}) }) }), _jsx(Route, { path: "financials", element: _jsx(ProtectedRoute, { rolesAllowed: ["admin", "accountant"], children: _jsx(Financials, {}) }) }), _jsx(Route, { path: "transfer-pricing", element: _jsx(ProtectedRoute, { rolesAllowed: ["admin", "accountant"], children: _jsx(TransferPricing, {}) }) }), _jsx(Route, { path: "/qa-checklist", element: _jsx(ProtectedRoute, { rolesAllowed: ['admin'], children: _jsx(QAChecklist, {}) }) }), _jsx(Route, { path: "filing", element: _jsx(ProtectedRoute, { rolesAllowed: ["admin", "accountant"], children: _jsx(Filing, {}) }) }), _jsx(Route, { path: "assistant", element: _jsx(ProtectedRoute, { rolesAllowed: ["admin", "accountant", "assistant", "sme_client"], children: _jsx(Assistant, {}) }) }), _jsx(Route, { path: "calendar", element: _jsx(ProtectedRoute, { rolesAllowed: ["admin", "accountant", "assistant", "sme_client"], children: _jsx(Calendar, {}) }) }), _jsx(Route, { path: "simple-invoice", element: _jsx(ProtectedRoute, { rolesAllowed: ["admin", "accountant"], children: _jsx(SimpleInvoice, {}) }) }), _jsx(Route, { path: "unauthorized", element: _jsx(Unauthorized, {}) }), _jsx(Route, { path: "qa-check", element: _jsx(ProtectedRoute, { rolesAllowed: ["admin"], children: _jsx(QATest, {}) }) })] })] }) }) })] }));
}
function App() {
    return (_jsx(I18nextProvider, { i18n: i18n, children: _jsx(SettingsProvider, { children: _jsx(FinanceProvider, { children: _jsx(CustomThemeProvider, { children: _jsx(TaxProvider, { children: _jsx(UserRoleProvider, { children: _jsx(NotificationProvider, { children: _jsx(TaxAgentProvider, { children: _jsx(POSIntegrationProvider, { children: _jsx(AppContent, {}) }) }) }) }) }) }) }) }) }));
}
export default App;
