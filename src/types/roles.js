export const ROLES = {
    ADMIN: 'admin',
    ACCOUNTANT: 'accountant',
    ASSISTANT: 'assistant',
    SME_CLIENT: 'sme_client'
};
export const ROLE_LABELS = {
    [ROLES.ADMIN]: 'Administrator',
    [ROLES.ACCOUNTANT]: 'Accountant',
    [ROLES.ASSISTANT]: 'Assistant',
    [ROLES.SME_CLIENT]: 'SME Client'
};
// Define which roles can access which routes
export const ROLE_PERMISSIONS = {
    '/dashboard': [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.ASSISTANT, ROLES.SME_CLIENT],
    '/accounting': [ROLES.ADMIN, ROLES.SME_CLIENT],
    '/cit': [ROLES.ADMIN, ROLES.ACCOUNTANT],
    '/vat': [ROLES.ADMIN, ROLES.ACCOUNTANT],
    '/financials': [ROLES.ADMIN, ROLES.ACCOUNTANT],
    '/transfer-pricing': [ROLES.ADMIN, ROLES.ACCOUNTANT],
    '/filing': [ROLES.ADMIN, ROLES.ACCOUNTANT],
    '/assistant': [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.ASSISTANT, ROLES.SME_CLIENT],
    '/calendar': [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.ASSISTANT, ROLES.SME_CLIENT],
    '/simple-invoice': [ROLES.ADMIN, ROLES.ACCOUNTANT],
    '/admin': [ROLES.ADMIN],
    '/qa-checklist': [ROLES.ADMIN],
    '/whitelabel': [ROLES.ADMIN],
    '/setup': [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.SME_CLIENT]
};
