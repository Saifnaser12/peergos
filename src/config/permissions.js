// Admin: Full access to everything
export const adminPermissions = {
    dashboard: { view: true, create: true, edit: true, delete: true },
    accounting: { view: true, create: true, edit: true, delete: true },
    filing: { view: true, create: true, edit: true, delete: true },
    vat: { view: true, create: true, edit: true, delete: true, submit: true },
    cit: { view: true, create: true, edit: true, delete: true, submit: true },
    financials: { view: true, create: true, edit: true, delete: true },
    'transfer-pricing': { view: true, create: true, edit: true, delete: true },
    assistant: { view: true, create: true, edit: true, delete: true },
    admin: { view: true, create: true, edit: true, delete: true },
    calendar: { view: true, create: true, edit: true, delete: true },
    'simple-invoice': { view: true, create: true, edit: true, delete: true },
    setup: { view: true, edit: true },
};
// Accountant: CIT, VAT, Financials, Reports
export const accountantPermissions = {
    dashboard: { view: true },
    cit: { view: true, create: true, edit: true, submit: true },
    vat: { view: true, create: true, edit: true, submit: true },
    financials: { view: true, create: true, edit: true },
    'transfer-pricing': { view: true, create: true, edit: true },
    filing: { view: true, create: true, edit: true },
    assistant: { view: true },
    calendar: { view: true },
    'simple-invoice': { view: true, create: true, edit: true },
    setup: { view: true },
};
// Assistant: View-only for all pages
export const assistantPermissions = {
    dashboard: { view: true },
    accounting: { view: true },
    filing: { view: true },
    vat: { view: true },
    cit: { view: true },
    financials: { view: true },
    'transfer-pricing': { view: true },
    assistant: { view: true },
    calendar: { view: true },
    'simple-invoice': { view: true },
    setup: { view: true },
};
// SME Client: Dashboard, Accounting, Assistant
export const smeClientPermissions = {
    dashboard: { view: true },
    accounting: { view: true, create: true, edit: true },
    assistant: { view: true },
    calendar: { view: true },
    setup: { view: true, edit: true },
};
// Legacy permissions for backward compatibility
export const userPermissions = smeClientPermissions;
export const auditorPermissions = assistantPermissions;
export const superAdminPermissions = adminPermissions;
