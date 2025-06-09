export interface BankTransaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  description: string;
  reference: string;
  type: 'debit' | 'credit';
  balance: number;
  category?: string;
  isReconciled: boolean;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  iban: string;
  currency: string;
  currentBalance: number;
  lastSyncDate?: string;
}

export interface BankIntegrationConfig {
  bankId: string;
  accountId: string;
  apiKey?: string;
  connectionStatus: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  autoReconcile: boolean;
}

export class BankIntegrationService {
  private static readonly SUPPORTED_BANKS = [
    { id: 'adcb', name: 'Abu Dhabi Commercial Bank', apiSupported: false },
    { id: 'emirates_nbd', name: 'Emirates NBD', apiSupported: false },
    { id: 'fab', name: 'First Abu Dhabi Bank', apiSupported: false },
    { id: 'mashreq', name: 'Mashreq Bank', apiSupported: false },
    { id: 'cbd', name: 'Commercial Bank of Dubai', apiSupported: false },
    { id: 'manual', name: 'Manual Upload', apiSupported: true }
  ];

  /**
   * Get list of supported banks for integration
   */
  static getSupportedBanks() {
    return this.SUPPORTED_BANKS;
  }

  /**
   * Placeholder: Connect to bank API
   * Currently returns mock connection for demo purposes
   */
  static async connectBank(bankId: string, credentials: any): Promise<BankIntegrationConfig> {
    // Simulate API connection delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock successful connection
    return {
      bankId,
      accountId: `acc_${Date.now()}`,
      connectionStatus: 'connected',
      lastSync: new Date().toISOString(),
      autoReconcile: false
    };
  }

  /**
   * Placeholder: Fetch bank statements
   * Returns mock transactions for demo purposes
   */
  static async fetchBankStatements(
    accountId: string, 
    fromDate: string, 
    toDate: string
  ): Promise<BankTransaction[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate mock transactions
    const mockTransactions: BankTransaction[] = [
      {
        id: 'txn_001',
        date: new Date().toISOString().split('T')[0],
        amount: 15000,
        currency: 'AED',
        description: 'Client Payment - Invoice #INV-2024-001',
        reference: 'REF123456',
        type: 'credit',
        balance: 45000,
        isReconciled: false
      },
      {
        id: 'txn_002',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        amount: -2500,
        currency: 'AED',
        description: 'Office Rent Payment',
        reference: 'RENT_JAN_2024',
        type: 'debit',
        balance: 30000,
        category: 'Rent',
        isReconciled: false
      }
    ];

    return mockTransactions;
  }

  /**
   * Placeholder: Auto-reconcile transactions with accounting entries
   */
  static async autoReconcileTransactions(
    transactions: BankTransaction[], 
    accountingEntries: any[]
  ): Promise<{ matched: number; unmatched: BankTransaction[] }> {
    let matched = 0;
    const unmatched: BankTransaction[] = [];

    for (const transaction of transactions) {
      // Simple matching logic (placeholder)
      const match = accountingEntries.find(entry => 
        Math.abs(entry.amount - Math.abs(transaction.amount)) < 0.01 &&
        new Date(entry.date).toDateString() === new Date(transaction.date).toDateString()
      );

      if (match) {
        matched++;
        transaction.isReconciled = true;
      } else {
        unmatched.push(transaction);
      }
    }

    return { matched, unmatched };
  }

  /**
   * Upload bank statement file for manual processing
   */
  static async uploadBankStatement(file: File): Promise<BankTransaction[]> {
    // Placeholder: Parse CSV/Excel bank statement
    const mockParsedTransactions: BankTransaction[] = [
      {
        id: `upload_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        amount: 8500,
        currency: 'AED',
        description: 'Uploaded Transaction from Bank Statement',
        reference: 'UPLOAD_REF',
        type: 'credit',
        balance: 0, // Will be calculated
        isReconciled: false
      }
    ];

    return mockParsedTransactions;
  }

  /**
   * Get reconciliation summary for dashboard
   */
  static async getReconciliationSummary(accountId: string): Promise<{
    totalTransactions: number;
    reconciledTransactions: number;
    unreconciledAmount: number;
    lastReconciliationDate: string;
  }> {
    // Mock summary data
    return {
      totalTransactions: 45,
      reconciledTransactions: 38,
      unreconciledAmount: 12500,
      lastReconciliationDate: new Date().toISOString()
    };
  }
}

// Export types for use in components
export type { BankTransaction, BankAccount, BankIntegrationConfig };