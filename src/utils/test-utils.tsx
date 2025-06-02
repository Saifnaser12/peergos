import React from 'react';
import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TaxProvider } from '../context/TaxContext';
import { ThemeProvider } from '../context/ThemeContext';
import { SettingsProvider } from '../context/SettingsContext';
import { UserRoleProvider } from '../context/UserRoleContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <TaxProvider>
          <UserRoleProvider>
            <I18nextProvider i18n={i18n}>
              <BrowserRouter>{children}</BrowserRouter>
            </I18nextProvider>
          </UserRoleProvider>
        </TaxProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options = {}
) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render }; 