export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE'
}

export enum AccountCategory {
  // Asset categories
  CURRENT_ASSETS = 'CURRENT_ASSETS',
  FIXED_ASSETS = 'FIXED_ASSETS',
  INTANGIBLE_ASSETS = 'INTANGIBLE_ASSETS',
  OTHER_ASSETS = 'OTHER_ASSETS',

  // Liability categories
  CURRENT_LIABILITIES = 'CURRENT_LIABILITIES',
  LONG_TERM_LIABILITIES = 'LONG_TERM_LIABILITIES',
  OTHER_LIABILITIES = 'OTHER_LIABILITIES',

  // Equity categories
  SHARE_CAPITAL = 'SHARE_CAPITAL',
  RETAINED_EARNINGS = 'RETAINED_EARNINGS',
  RESERVES = 'RESERVES'
}

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  category: AccountCategory;
  balance: number;
  isLocked: boolean; // If true, balance can't be manually overridden
  description?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  debitAccountId: string;
  creditAccountId: string;
  amount: number;
  reference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BalanceSheet {
  asOf: string;
  assets: {
    currentAssets: Account[];
    fixedAssets: Account[];
    intangibleAssets: Account[];
    otherAssets: Account[];
    totalAssets: number;
  };
  liabilities: {
    currentLiabilities: Account[];
    longTermLiabilities: Account[];
    otherLiabilities: Account[];
    totalLiabilities: number;
  };
  equity: {
    shareCapital: Account[];
    retainedEarnings: Account[];
    reserves: Account[];
    totalEquity: number;
  };
  totalLiabilitiesAndEquity: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
  }[];
}

export interface BalanceSheetState {
  accounts: Account[];
  journalEntries: JournalEntry[];
  currentBalanceSheet: BalanceSheet | null;
  loading: boolean;
  error: string | null;
} 