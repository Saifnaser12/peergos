export type UserRole = 'SME' | 'Tax Agent' | 'Admin' | 'FTA';

export interface UserRoleState {
  role: UserRole;
}

export interface CompanyProfile {
  companyName: string;
  trnNumber: string;
  licenseType: 'mainland' | 'freezone' | 'offshore';
  revenue: number;
}

export interface RevenueEntry {
  id: string;
  date: string;
  source: 'POS' | 'Bank Transfer' | 'Cash' | 'Other';
  amount: number;
  vatIncluded: boolean;
  proofUrl?: string;
  vatAmount: number;
}

export interface ExpenseEntry {
  id: string;
  date: string;
  category: 'Office' | 'Salaries' | 'Utilities' | 'Equipment' | 'Other';
  amount: number;
  receiptUrl?: string;
}

export interface TaxState {
  profile: CompanyProfile | null;
  revenues: RevenueEntry[];
  expenses: ExpenseEntry[];
} 