import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Badge,
  Tooltip
} from '@mui/material';
import {
  ChartBarIcon,
  DocumentTextIcon,
  CalculatorIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const drawerWidth = 280;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
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
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title={t('notifications.title', 'Notifications')}>
              <IconButton
                size="large"
                edge="end"
                aria-label="notifications"
                aria-haspopup="true"
                onClick={handleNotificationsMenuOpen}
                color="inherit"
              >
                <Badge badgeContent={3} color="error">
                  <BellIcon className="h-6 w-6" />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title={t('profile.title', 'Profile')}>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  <UserCircleIcon className="h-6 w-6" />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={open}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          },
        }}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BuildingOfficeIcon className="h-8 w-8 text-primary-600" />
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
              TaxPro
            </Typography>
          </Box>
          {!isMobile && (
            <IconButton onClick={handleDrawerToggle}>
              <ChevronLeftIcon className="h-5 w-5" />
            </IconButton>
          )}
        </Toolbar>
        <Divider />
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <ListItem
                button
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  backgroundColor: isActive ? 'primary.50' : 'transparent',
                  color: isActive ? 'primary.main' : 'text.primary',
                  '&:hover': {
                    backgroundColor: isActive ? 'primary.100' : 'grey.100',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'inherit' }}>
                  <Icon className="h-5 w-5" />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${open ? drawerWidth : 0}px)` },
          ml: { md: `${open ? drawerWidth : 0}px` },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          mt: '64px',
        }}
      >
        {children}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
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
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => navigate('/profile')}>
          <ListItemIcon>
            <UserCircleIcon className="h-5 w-5" />
          </ListItemIcon>
          {t('profile.settings', 'Profile Settings')}
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
          </ListItemIcon>
          {t('auth.logout', 'Logout')}
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            width: 320,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {t('notifications.vatDue', 'VAT Return Due')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('notifications.vatDueDesc', 'Your VAT return for Q1 2024 is due in 5 days')}
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {t('notifications.citUpdate', 'CIT Update')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('notifications.citUpdateDesc', 'New CIT regulations have been published')}
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {t('notifications.transferPricing', 'Transfer Pricing')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('notifications.transferPricingDesc', 'Your transfer pricing documentation needs review')}
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Layout; 
import React from 'react';
import { Box, AppBar, Toolbar, Typography, Container } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'VAT', path: '/vat' },
    { label: 'CIT', path: '/cit' },
    { label: 'Financials', path: '/financials' },
    { label: 'Transfer Pricing', path: '/transfer-pricing' },
    { label: 'Assistant', path: '/assistant' },
    { label: 'Setup', path: '/setup' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Peergos Tax Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {navigationItems.map((item) => (
              <Typography
                key={item.path}
                variant="body1"
                sx={{
                  cursor: 'pointer',
                  textDecoration: location.pathname === item.path ? 'underline' : 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Typography>
            ))}
            <Typography
              variant="body1"
              sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              onClick={handleLogout}
            >
              Logout
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
import React from 'react';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Peergos Tax System
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => navigate('/vat')}>
            VAT
          </Button>
          <Button color="inherit" onClick={() => navigate('/cit')}>
            CIT
          </Button>
          <Button color="inherit" onClick={() => navigate('/financials')}>
            Financials
          </Button>
          <Button color="inherit" onClick={() => navigate('/transfer-pricing')}>
            Transfer Pricing
          </Button>
          <Button color="inherit" onClick={() => navigate('/assistant')}>
            Assistant
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
