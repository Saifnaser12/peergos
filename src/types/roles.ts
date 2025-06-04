
export type Role = 'admin' | 'accountant' | 'assistant' | 'viewer';

export const ROLES = {
  ADMIN: 'admin' as const,
  ACCOUNTANT: 'accountant' as const,
  ASSISTANT: 'assistant' as const,
  VIEWER: 'viewer' as const,
} as const;

export const ROLE_PERMISSIONS: Record<string, Role[]> = {
  '/dashboard': ['admin', 'accountant', 'assistant', 'viewer'],
  '/cit': ['admin', 'accountant', 'assistant'],
  '/vat': ['admin', 'accountant'],
  '/financials': ['admin', 'accountant'],
  '/transfer-pricing': ['admin'],
  '/assistant': ['admin', 'accountant', 'assistant'],
  '/setup': ['admin'],
  '/admin': ['admin'],
};

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrator',
  accountant: 'Accountant',
  assistant: 'Assistant',
  viewer: 'Viewer',
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  admin: 'Full access to all features and settings',
  accountant: 'Access to tax filings, VAT, CIT, and financials',
  assistant: 'Limited access to CIT and assistant features',
  viewer: 'Read-only access to dashboard',
};
