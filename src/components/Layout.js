import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Box, AppBar, Toolbar, Typography, Container, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Dashboard as DashboardIcon, Receipt as VATIcon, Business as CITIcon, AccountBalance as FinancialsIcon, SwapHoriz as TransferPricingIcon, Description as FilingIcon, Settings as SetupIcon, Assistant as AssistantIcon, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
const drawerWidth = 240;
const navigationItems = [
    { text: 'Dashboard', path: '/dashboard', icon: _jsx(DashboardIcon, {}) },
    { text: 'VAT', path: '/vat', icon: _jsx(VATIcon, {}) },
    { text: 'CIT', path: '/cit', icon: _jsx(CITIcon, {}) },
    { text: 'Financials', path: '/financials', icon: _jsx(FinancialsIcon, {}) },
    { text: 'Transfer Pricing', path: '/transfer-pricing', icon: _jsx(TransferPricingIcon, {}) },
    { text: 'Filing', path: '/filing', icon: _jsx(FilingIcon, {}) },
    { text: 'Setup', path: '/setup', icon: _jsx(SetupIcon, {}) },
    { text: 'Assistant', path: '/assistant', icon: _jsx(AssistantIcon, {}) },
];
const Layout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const handleNavigation = (path) => {
        navigate(path);
        if (isMobile) {
            setMobileOpen(false);
        }
    };
    const drawer = (_jsxs("div", { children: [_jsx(Toolbar, { children: _jsx(Typography, { variant: "h6", noWrap: true, component: "div", children: "Tax System" }) }), _jsx(List, { children: navigationItems.map((item) => (_jsx(ListItem, { disablePadding: true, children: _jsxs(ListItemButton, { onClick: () => handleNavigation(item.path), selected: location.pathname === item.path, sx: {
                            '&.Mui-selected': {
                                backgroundColor: theme.palette.primary.main + '20',
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.main + '30',
                                },
                            },
                        }, children: [_jsx(ListItemIcon, { sx: {
                                    color: location.pathname === item.path
                                        ? theme.palette.primary.main
                                        : 'inherit'
                                }, children: item.icon }), _jsx(ListItemText, { primary: item.text, sx: {
                                    color: location.pathname === item.path
                                        ? theme.palette.primary.main
                                        : 'inherit'
                                } })] }) }, item.text))) })] }));
    return (_jsxs(Box, { sx: { display: 'flex' }, children: [_jsx(AppBar, { position: "fixed", sx: {
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                }, children: _jsxs(Toolbar, { children: [_jsx(IconButton, { color: "inherit", "aria-label": "open drawer", edge: "start", onClick: handleDrawerToggle, sx: { mr: 2, display: { md: 'none' } }, children: _jsx(MenuIcon, {}) }), _jsx(Typography, { variant: "h6", noWrap: true, component: "div", children: "Tax Compliance System" })] }) }), _jsxs(Box, { component: "nav", sx: { width: { md: drawerWidth }, flexShrink: { md: 0 } }, children: [_jsx(Drawer, { variant: "temporary", open: mobileOpen, onClose: handleDrawerToggle, ModalProps: {
                            keepMounted: true,
                        }, sx: {
                            display: { xs: 'block', md: 'none' },
                            '& .MuiDrawer-paper': {
                                boxSizing: 'border-box',
                                width: drawerWidth,
                            },
                        }, children: drawer }), _jsx(Drawer, { variant: "permanent", sx: {
                            display: { xs: 'none', md: 'block' },
                            '& .MuiDrawer-paper': {
                                boxSizing: 'border-box',
                                width: drawerWidth,
                            },
                        }, open: true, children: drawer })] }), _jsxs(Box, { component: "main", sx: {
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                }, children: [_jsx(Toolbar, {}), _jsx(Container, { maxWidth: "lg", children: children })] })] }));
};
export default Layout;
