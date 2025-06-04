export type Permission = 'view' | 'edit';
export type Resource = 'setup' | 'filing' | 'dashboard' | 'trnSearch' | 'assistant' | 'transfer-pricing' | 'vat' | 'cit' | 'financials' | 'admin';

export interface ResourcePermissions {
  view: boolean;
  edit: boolean;
}

export interface UserPermissions {
  [key: string]: ResourcePermissions;
}

export const adminPermissions: UserPermissions = {
  setup: { view: true, edit: true },
  filing: { view: true, edit: true },
  dashboard: { view: true, edit: false },
  trnSearch: { view: false, edit: false },
  assistant: { view: true, edit: false },
  'transfer-pricing': { view: true, edit: true },
  vat: { view: true, edit: true },
  cit: { view: true, edit: true },
  financials: { view: true, edit: true },
  admin: { view: true, edit: true }
};

export const userPermissions: UserPermissions = {
  setup: { view: true, edit: false },
  filing: { view: true, edit: false },
  dashboard: { view: true, edit: false },
  trnSearch: { view: false, edit: false },
  assistant: { view: true, edit: false },
  'transfer-pricing': { view: true, edit: false },
  vat: { view: true, edit: false },
  cit: { view: true, edit: false },
  financials: { view: true, edit: false },
  admin: { view: false, edit: false }
};

export const superAdminPermissions: UserPermissions = {
  setup: { view: true, edit: true },
  filing: { view: true, edit: true },
  dashboard: { view: true, edit: true },
  trnSearch: { view: true, edit: true },
  assistant: { view: true, edit: true },
  'transfer-pricing': { view: true, edit: true },
  vat: { view: true, edit: true },
  cit: { view: true, edit: true },
  financials: { view: true, edit: true },
  admin: { view: true, edit: true }
};

export const auditorPermissions: UserPermissions = {
  setup: { view: false, edit: false },
  filing: { view: false, edit: false },
  dashboard: { view: true, edit: false },
  trnSearch: { view: true, edit: true },
  assistant: { view: false, edit: false },
  'transfer-pricing': { view: true, edit: false },
  vat: { view: true, edit: false },
  cit: { view: true, edit: false },
  financials: { view: true, edit: false },
  admin: { view: false, edit: false }
}; 
export type Permission = 'view' | 'create' | 'edit' | 'delete' | 'submit';
export type Resource = 'dashboard' | 'filing' | 'vat' | 'cit' | 'financials' | 'transfer-pricing' | 'assistant' | 'admin' | 'setup';

type PermissionSet = {
  [key in Resource]?: {
    [key in Permission]?: boolean;
  };
};

export const userPermissions: PermissionSet = {
  dashboard: { view: true },
  filing: { view: true, create: true, edit: true },
  vat: { view: true, create: true, edit: true, submit: true },
  cit: { view: true, create: true, edit: true, submit: true },
  financials: { view: true },
  'transfer-pricing': { view: true, create: true, edit: true },
  assistant: { view: true },
  setup: { view: true, edit: true },
};

export const adminPermissions: PermissionSet = {
  dashboard: { view: true },
  filing: { view: true, create: true, edit: true, delete: true },
  vat: { view: true, create: true, edit: true, delete: true, submit: true },
  cit: { view: true, create: true, edit: true, delete: true, submit: true },
  financials: { view: true, create: true, edit: true, delete: true },
  'transfer-pricing': { view: true, create: true, edit: true, delete: true },
  assistant: { view: true },
  admin: { view: true, create: true, edit: true, delete: true },
  setup: { view: true, edit: true },
};

export const auditorPermissions: PermissionSet = {
  dashboard: { view: true },
  filing: { view: true },
  vat: { view: true },
  cit: { view: true },
  financials: { view: true },
  'transfer-pricing': { view: true },
  assistant: { view: true },
};

export const superAdminPermissions: PermissionSet = {
  dashboard: { view: true, create: true, edit: true, delete: true },
  filing: { view: true, create: true, edit: true, delete: true },
  vat: { view: true, create: true, edit: true, delete: true, submit: true },
  cit: { view: true, create: true, edit: true, delete: true, submit: true },
  financials: { view: true, create: true, edit: true, delete: true },
  'transfer-pricing': { view: true, create: true, edit: true, delete: true },
  assistant: { view: true, create: true, edit: true, delete: true },
  admin: { view: true, create: true, edit: true, delete: true },
  setup: { view: true, edit: true },
};
