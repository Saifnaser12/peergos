import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
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
const App = () => {
    const { t } = useTranslation();
    const { role } = useUserRole();
    // Check if user is authenticated
    const isAuthenticated = () => {
        const user = localStorage.getItem('user');
        return !!user;
    };
    // Protected route component
    const ProtectedRoute = ({ children }) => {
        if (!isAuthenticated()) {
            return _jsx(Navigate, { to: "/login" });
        }
        return _jsx(_Fragment, { children: children });
    };
    return (_jsxs(ThemeProvider, { theme: theme, children: [_jsx(CssBaseline, {}), _jsx(TaxProvider, { children: _jsx(RelatedPartyProvider, { children: _jsx(I18nextProvider, { i18n: i18n, children: _jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(Layout, { children: _jsxs(Routes, { children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "financials", element: _jsx(Financials, {}) }), _jsx(Route, { path: "transfer-pricing", element: _jsx(TransferPricingPage, {}) }), _jsx(Route, { path: "assistant", element: _jsx(Assistant, {}) }), _jsx(Route, { path: "setup", element: _jsx(Setup, {}) })] }) }) }) })] }) }) }) }) })] }));
};
export default App;
