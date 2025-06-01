export type UserRole = 'SME' | 'Tax Agent' | 'Admin' | 'FTA';

export interface UserRoleState {
  role: UserRole;
}

export interface CompanyProfile {
  companyName: string;
  trnNumber: string;
  licenseType: string;
  email: string;
  phone: string;
  address: string;
  businessActivity: string;
  vatRegistered: boolean;
  citRegistered: boolean;
  citSubmissionDate?: string;
}

export interface RevenueEntry {
  id: string;
  date: string;
  amount: number;
  source: string;
  vatAmount: number;
}

export interface ExpenseEntry {
  id: string;
  date: string;
  amount: number;
  category: string;
}

export interface TaxState {
  profile: CompanyProfile | null;
  revenues: RevenueEntry[];
  expenses: ExpenseEntry[];
}

export type AuditAction =
  | 'PROFILE_UPDATE'
  | 'REVENUE_ADD'
  | 'EXPENSE_ADD'
  | 'DOCUMENT_UPLOAD'
  | 'SUBMISSION'
  | 'ASSISTANT_RESPONSE'
  | 'COMPLIANCE_CHECK'; 