import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import { TaxAgentProvider } from './context/TaxAgentContext';
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
import Admin from './pages/Admin';
import Calendar from './pages/Calendar';
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
const App = () => {
    const theme = createTheme({
        palette: {
            mode: 'light',
        },
    });
    return (_jsx(ErrorBoundary, { children: _jsxs(MuiThemeProvider, { theme: theme, children: [_jsx(CssBaseline, {}), _jsx(WhitelabelProvider, { children: _jsx(ThemeProvider, { children: _jsx(UserRoleProvider, { children: _jsx(NotificationProvider, { children: _jsx(SettingsProvider, { children: _jsx(TaxAgentProvider, { children: _jsx(POSIntegrationProvider, { children: _jsx(FinanceProvider, { children: _jsx(TaxProvider, { children: _jsx(InvoiceProvider, { children: _jsx(TransferPricingProvider, { children: _jsx(RelatedPartyProvider, { children: _jsx(BalanceSheetProvider, { children: _jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/landing", element: _jsx(Landing, {}) }), _jsx(Route, { path: "/unauthorized", element: _jsx(Unauthorized, {}) }), _jsxs(Route, { path: "/", element: _jsx(Layout, {}), children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "dashboard", element: _jsx(ProtectedRoute, { allowedRoles: ['admin', 'accountant', 'assistant', 'sme_client'], children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "accounting", element: _jsx(ProtectedRoute, { allowedRoles: ['admin', 'accountant'], children: _jsx(Accounting, {}) }) }), _jsx(Route, { path: "vat", element: _jsx(ProtectedRoute, { allowedRoles: ['admin', 'accountant'], children: _jsx(VAT, {}) }) }), _jsx(Route, { path: "cit", element: _jsx(ProtectedRoute, { allowedRoles: ['admin', 'accountant'], children: _jsx(CIT, {}) }) }), _jsx(Route, { path: "filing", element: _jsx(ProtectedRoute, { allowedRoles: ['admin', 'accountant'], children: _jsx(Filing, {}) }) }), _jsx(Route, { path: "financials", element: _jsx(ProtectedRoute, { allowedRoles: ['admin', 'accountant', 'assistant'], children: _jsx(ErrorBoundary, { children: _jsx(Financials, {}) }) }) }), _jsx(Route, { path: "transfer-pricing", element: _jsx(ProtectedRoute, { allowedRoles: ['admin', 'accountant'], children: _jsx(TransferPricing, {}) }) }), _jsx(Route, { path: "simple-invoice", element: _jsx(ProtectedRoute, { allowedRoles: ['admin', 'accountant', 'assistant'], children: _jsx(SimpleInvoice, {}) }) }), _jsx(Route, { path: "assistant", element: _jsx(ProtectedRoute, { allowedRoles: ['admin', 'accountant', 'assistant', 'sme_client'], children: _jsx(Assistant, {}) }) }), _jsx(Route, { path: "admin", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(Admin, {}) }) }), _jsx(Route, { path: "calendar", element: _jsx(ProtectedRoute, { allowedRoles: ['admin', 'accountant', 'assistant', 'sme_client'], children: _jsx(Calendar, {}) }) }), _jsx(Route, { path: "setup", element: _jsx(ProtectedRoute, { allowedRoles: ['admin', 'accountant'], children: _jsx(Setup, {}) }) }), _jsx(Route, { path: "assistant-test", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AssistantTest, {}) }) }), _jsx(Route, { path: "qa-test", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(QATest, {}) }) }), _jsx(Route, { path: "whitelabel", element: _jsx(ProtectedRoute, { allowedRoles: ['admin'], children: _jsx(WhitelabelPage, {}) }) }), _jsx(Route, { path: "freezone-substance", element: _jsx(ProtectedRoute, { allowedRoles: ['admin', 'accountant'], children: _jsx(FreeZoneSubstance, {}) }) }), _jsx(Route, { path: "financials-test", element: _jsx(FinancialsTest, {}) })] })] }) }) }) }) }) }) }) }) }) }) }) }) }) }) })] }) }));
};
export default App;
