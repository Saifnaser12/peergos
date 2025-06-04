import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
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
const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return _jsx(Navigate, { to: "/login" });
    }
    return _jsx(Layout, { children: children });
};
const App = () => {
    return (_jsx(ThemeProvider, { theme: theme, children: _jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "/vat", element: _jsx(ProtectedRoute, { children: _jsx(VAT, {}) }) }), _jsx(Route, { path: "/cit", element: _jsx(ProtectedRoute, { children: _jsx(CIT, {}) }) }), _jsx(Route, { path: "/financials", element: _jsx(ProtectedRoute, { children: _jsx(Financials, {}) }) }), _jsx(Route, { path: "/transfer-pricing", element: _jsx(ProtectedRoute, { children: _jsx(TransferPricing, {}) }) }), _jsx(Route, { path: "/assistant", element: _jsx(ProtectedRoute, { children: _jsx(Assistant, {}) }) }), _jsx(Route, { path: "/setup", element: _jsx(ProtectedRoute, { children: _jsx(Setup, {}) }) })] }) }) }));
};
export default App;
