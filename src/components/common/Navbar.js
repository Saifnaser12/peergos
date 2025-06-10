import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from './LanguageToggle';
export const Navbar = () => {
    const { t } = useTranslation();
    const menuItems = [
        {
            path: '/transfer-pricing',
            label: t('app.navigation.transferPricing'),
            icon: _jsx(DescriptionIcon, {}),
        },
    ];
    return (_jsx(AppBar, { position: "static", children: _jsxs(Toolbar, { children: [_jsx(Typography, { variant: "h6", component: "div", sx: { flexGrow: 1 }, children: t('app.title') }), _jsxs(Box, { sx: { display: 'flex', gap: 2, alignItems: 'center' }, children: [menuItems.map((item) => (_jsx(IconButton, { component: Link, to: item.path, color: "inherit", title: item.label, children: item.icon }, item.path))), _jsx(LanguageToggle, {})] })] }) }));
};
