export type Permission = 'view' | 'edit';
export type Resource = 'setup' | 'filing' | 'dashboard' | 'trnSearch' | 'assistant' | 'transfer-pricing';

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
  'transfer-pricing': { view: true, edit: true }
};

export const userPermissions: UserPermissions = {
  setup: { view: true, edit: false },
  filing: { view: true, edit: false },
  dashboard: { view: true, edit: false },
  trnSearch: { view: false, edit: false },
  assistant: { view: true, edit: false },
  'transfer-pricing': { view: true, edit: false }
};

export const superAdminPermissions: UserPermissions = {
  setup: { view: true, edit: true },
  filing: { view: true, edit: true },
  dashboard: { view: true, edit: true },
  trnSearch: { view: true, edit: true },
  assistant: { view: true, edit: true },
  'transfer-pricing': { view: true, edit: true }
};

export const auditorPermissions: UserPermissions = {
  setup: { view: false, edit: false },
  filing: { view: false, edit: false },
  dashboard: { view: true, edit: false },
  trnSearch: { view: true, edit: true },
  assistant: { view: false, edit: false },
  'transfer-pricing': { view: true, edit: false }
}; 