import { jsx as _jsx } from "react/jsx-runtime";
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TaxProvider } from '../context/TaxContext';
import { ThemeProvider } from '../context/ThemeContext';
import { SettingsProvider } from '../context/SettingsContext';
import { UserRoleProvider } from '../context/UserRoleContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
const AllTheProviders = ({ children }) => {
    return (_jsx(SettingsProvider, { children: _jsx(ThemeProvider, { children: _jsx(TaxProvider, { children: _jsx(UserRoleProvider, { children: _jsx(I18nextProvider, { i18n: i18n, children: _jsx(BrowserRouter, { children: children }) }) }) }) }) }));
};
const customRender = (ui, options = {}) => render(ui, { wrapper: AllTheProviders, ...options });
// re-export everything
export * from '@testing-library/react';
// override render method
export { customRender as render };
