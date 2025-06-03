import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemIcon, ListItemText, Avatar, Menu, MenuItem, useTheme, useMediaQuery, Badge, Tooltip } from '@mui/material';
import { ChartBarIcon, DocumentTextIcon, CalculatorIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, UserCircleIcon, BellIcon, ChevronLeftIcon, BuildingOfficeIcon, ChatBubbleLeftRightIcon, CurrencyDollarIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
const drawerWidth = 280;
const Layout = ({ children }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(!isMobile);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
    const handleDrawerToggle = () => {
        setOpen(!open);
    };
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleNotificationsMenuOpen = (event) => {
        setNotificationsAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        setNotificationsAnchorEl(null);
    };
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };
    const menuItems = [
        { path: '/dashboard', icon: ChartBarIcon, text: t('nav.dashboard') },
        { path: '/vat', icon: DocumentTextIcon, text: t('nav.vat') },
        { path: '/cit', icon: CalculatorIcon, text: t('nav.cit') },
        { path: '/financials', icon: CurrencyDollarIcon, text: t('nav.financials') },
        { path: '/transfer-pricing', icon: DocumentDuplicateIcon, text: t('nav.transferPricing') },
        { path: '/assistant', icon: ChatBubbleLeftRightIcon, text: t('nav.assistant') },
        { path: '/setup', icon: Cog6ToothIcon, text: t('nav.setup') },
    ];
    return (_jsxs(Box, { sx: { display: 'flex', minHeight: '100vh' }, children: [_jsx(AppBar, { position: "fixed", sx: {
                    width: { md: `calc(100% - ${open ? drawerWidth : 0}px)` },
                    ml: { md: `${open ? drawerWidth : 0}px` },
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    backgroundColor: 'white',
                    color: 'text.primary',
                    boxShadow: 'none',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }, children: _jsxs(Toolbar, { children: [_jsx(IconButton, { color: "inherit", "aria-label": "open drawer", edge: "start", onClick: handleDrawerToggle, sx: { mr: 2, display: { md: 'none' } }, children: _jsx(ChevronLeftIcon, { className: "h-6 w-6" }) }), _jsx(Box, { sx: { flexGrow: 1 } }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2 }, children: [_jsx(Tooltip, { title: t('notifications.title', 'Notifications'), children: _jsx(IconButton, { size: "large", edge: "end", "aria-label": "notifications", "aria-haspopup": "true", onClick: handleNotificationsMenuOpen, color: "inherit", children: _jsx(Badge, { badgeContent: 3, color: "error", children: _jsx(BellIcon, { className: "h-6 w-6" }) }) }) }), _jsx(Tooltip, { title: t('profile.title', 'Profile'), children: _jsx(IconButton, { size: "large", edge: "end", "aria-label": "account of current user", "aria-haspopup": "true", onClick: handleProfileMenuOpen, color: "inherit", children: _jsx(Avatar, { sx: { width: 32, height: 32, bgcolor: 'primary.main' }, children: _jsx(UserCircleIcon, { className: "h-6 w-6" }) }) }) })] })] }) }), _jsxs(Drawer, { variant: isMobile ? 'temporary' : 'persistent', open: open, onClose: handleDrawerToggle, sx: {
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        borderRight: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: 'background.paper',
                    },
                }, children: [_jsxs(Toolbar, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(BuildingOfficeIcon, { className: "h-8 w-8 text-primary-600" }), _jsx(Typography, { variant: "h6", noWrap: true, component: "div", sx: { fontWeight: 600 }, children: "TaxPro" })] }), !isMobile && (_jsx(IconButton, { onClick: handleDrawerToggle, children: _jsx(ChevronLeftIcon, { className: "h-5 w-5" }) }))] }), _jsx(Divider, {}), _jsx(List, { sx: { px: 2 }, children: menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (_jsxs(ListItem, { button: true, onClick: () => navigate(item.path), sx: {
                                    borderRadius: 2,
                                    mb: 0.5,
                                    backgroundColor: isActive ? 'primary.50' : 'transparent',
                                    color: isActive ? 'primary.main' : 'text.primary',
                                    '&:hover': {
                                        backgroundColor: isActive ? 'primary.100' : 'grey.100',
                                    },
                                }, children: [_jsx(ListItemIcon, { sx: { color: isActive ? 'primary.main' : 'inherit' }, children: _jsx(Icon, { className: "h-5 w-5" }) }), _jsx(ListItemText, { primary: item.text })] }, item.path));
                        }) })] }), _jsx(Box, { component: "main", sx: {
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${open ? drawerWidth : 0}px)` },
                    ml: { md: `${open ? drawerWidth : 0}px` },
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    mt: '64px',
                }, children: children }), _jsxs(Menu, { anchorEl: anchorEl, open: Boolean(anchorEl), onClose: handleMenuClose, PaperProps: {
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                    },
                }, transformOrigin: { horizontal: 'right', vertical: 'top' }, anchorOrigin: { horizontal: 'right', vertical: 'bottom' }, children: [_jsxs(MenuItem, { onClick: () => navigate('/profile'), children: [_jsx(ListItemIcon, { children: _jsx(UserCircleIcon, { className: "h-5 w-5" }) }), t('profile.settings', 'Profile Settings')] }), _jsxs(MenuItem, { onClick: handleLogout, children: [_jsx(ListItemIcon, { children: _jsx(ArrowRightOnRectangleIcon, { className: "h-5 w-5" }) }), t('auth.logout', 'Logout')] })] }), _jsxs(Menu, { anchorEl: notificationsAnchorEl, open: Boolean(notificationsAnchorEl), onClose: handleMenuClose, PaperProps: {
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        width: 320,
                    },
                }, transformOrigin: { horizontal: 'right', vertical: 'top' }, anchorOrigin: { horizontal: 'right', vertical: 'bottom' }, children: [_jsx(MenuItem, { children: _jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', width: '100%' }, children: [_jsx(Typography, { variant: "subtitle2", sx: { fontWeight: 600 }, children: t('notifications.vatDue', 'VAT Return Due') }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: t('notifications.vatDueDesc', 'Your VAT return for Q1 2024 is due in 5 days') })] }) }), _jsx(MenuItem, { children: _jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', width: '100%' }, children: [_jsx(Typography, { variant: "subtitle2", sx: { fontWeight: 600 }, children: t('notifications.citUpdate', 'CIT Update') }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: t('notifications.citUpdateDesc', 'New CIT regulations have been published') })] }) }), _jsx(MenuItem, { children: _jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', width: '100%' }, children: [_jsx(Typography, { variant: "subtitle2", sx: { fontWeight: 600 }, children: t('notifications.transferPricing', 'Transfer Pricing') }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: t('notifications.transferPricingDesc', 'Your transfer pricing documentation needs review') })] }) })] })] }));
};
export default Layout;
