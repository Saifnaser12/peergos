import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Types
interface Revenue {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  customer?: string;
  vatAmount?: number;
  incomeClassification?: 'qualifying' | 'non-qualifying';
  activityType?: string;
  isExport?: boolean;
}

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  vendor?: string;
  vatAmount?: number;
  isRelatedPartyTransaction?: boolean;
}

interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  lastUpdated: string;
  isConnected: boolean;
}

interface FinanceContextType {
  revenue: Revenue[];
  expenses: Expense[];
  addRevenue: (revenue: Omit<Revenue, 'id'>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateRevenue: (id: string, revenue: Partial<Revenue>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteRevenue: (id: string) => void;
  deleteExpense: (id: string) => void;
  getTotalRevenue: () => number;
  getTotalExpenses: () => number;
  getNetIncome: () => number;
    getQualifyingIncome: () => number;
  getNonQualifyingIncome: () => number;
  getFinancialSummary: () => FinancialSummary;
  subscribeToUpdates: (callback: () => void) => () => void;
  isConnected: boolean;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Sample data
const initialRevenue: Revenue[] = [
  {
    id: '1',
    category: 'Product Sales',
    amount: 150000,
    date: '2024-01-15',
    description: 'Q1 Product Sales Revenue',
    customer: 'ABC Corp',
    vatAmount: 7500,
    incomeClassification: 'qualifying',
    activityType: 'export-services',
    isExport: true
  },
  {
    id: '2',
    category: 'Services',
    amount: 85000,
    date: '2024-01-20',
    description: 'Consulting and Professional Services',
    customer: 'XYZ Ltd',
    vatAmount: 4250,
    incomeClassification: 'non-qualifying'
  },
  {
    id: '3',
    category: 'Licensing',
    amount: 25000,
    date: '2024-01-25',
    description: 'Software Licensing Revenue',
    vatAmount: 1250,
    incomeClassification: 'qualifying',
    activityType: 'intra-zone-trade'
  }
];

const initialExpenses: Expense[] = [
  {
    id: '1',
    category: 'Salaries',
    amount: 65000,
    date: '2024-01-01',
    description: 'Monthly Staff Salaries',
    vendor: 'Payroll Department'
  },
  {
    id: '2',
    category: 'Rent',
    amount: 18000,
    date: '2024-01-01',
    description: 'Office Space Rental',
    vendor: 'Property Management Co.',
    vatAmount: 900
  },
  {
    id: '3',
    category: 'Utilities',
    amount: 4500,
    date: '2024-01-05',
    description: 'Electricity and Internet',
    vendor: 'Utility Company',
    vatAmount: 225
  },
  {
    id: '4',
    category: 'Marketing',
    amount: 12000,
    date: '2024-01-10',
    description: 'Digital Marketing Campaign',
    vendor: 'Marketing Agency',
    vatAmount: 600
  }
];

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  console.log('🏦 FinanceProvider initializing...');

  const [revenue, setRevenue] = useState<Revenue[]>(initialRevenue);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [updateCallbacks, setUpdateCallbacks] = useState<Set<() => void>>(new Set());
  const [isConnected] = useState(true);

  console.log('📊 Finance data initialized:', { 
    revenueCount: revenue.length, 
    expenseCount: expenses.length 
  });

  // Notify subscribers of updates
  const notifyUpdate = useCallback(() => {
    console.log('🔄 Notifying finance update subscribers...');
    updateCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.warn('⚠️ Error in finance update callback:', error);
      }
    });
  }, [updateCallbacks]);

  const addRevenue = useCallback((newRevenue: Omit<Revenue, 'id'>) => {
    try {
      const revenue: Revenue = {
        ...newRevenue,
        id: Date.now().toString()
      };
      console.log('💰 Adding revenue:', revenue);
      setRevenue(prev => [...prev, revenue]);
      notifyUpdate();
    } catch (error) {
      console.error('❌ Error adding revenue:', error);
    }
  }, [notifyUpdate]);

  const addExpense = useCallback((newExpense: Omit<Expense, 'id'>) => {
    try {
      const expense: Expense = {
        ...newExpense,
        id: Date.now().toString()
      };
      console.log('💸 Adding expense:', expense);
      setExpenses(prev => [...prev, expense]);
      notifyUpdate();
    } catch (error) {
      console.error('❌ Error adding expense:', error);
    }
  }, [notifyUpdate]);

  const updateRevenue = useCallback((id: string, updates: Partial<Revenue>) => {
    setRevenue(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
    notifyUpdate();
  }, [notifyUpdate]);

  const updateExpense = useCallback((id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
    notifyUpdate();
  }, [notifyUpdate]);

  const deleteRevenue = useCallback((id: string) => {
    setRevenue(prev => prev.filter(item => item.id !== id));
    notifyUpdate();
  }, [notifyUpdate]);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(item => item.id !== id));
    notifyUpdate();
  }, [notifyUpdate]);

  const getTotalRevenue = useCallback(() => {
    const total = revenue.reduce((sum, item) => sum + (item.amount || 0), 0);
    console.log('💰 Total revenue calculated:', total);
    return total;
  }, [revenue]);

  const getTotalExpenses = useCallback(() => {
    const total = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
    console.log('💸 Total expenses calculated:', total);
    return total;
  }, [expenses]);

  const getNetIncome = useCallback(() => {
    const net = getTotalRevenue() - getTotalExpenses();
    console.log('💎 Net income calculated:', net);
    return net;
  }, [getTotalRevenue, getTotalExpenses]);

  const getQualifyingIncome = useCallback((): number => {
    return revenue
      .filter(entry => entry.incomeClassification === 'qualifying' || 
                      entry.isExport === true ||
                      entry.activityType === 'export-services' ||
                      entry.activityType === 'intra-zone-trade' ||
                      entry.activityType === 'qualifying-activities')
      .reduce((sum, entry) => sum + entry.amount, 0);
  }, [revenue]);

  const getNonQualifyingIncome = useCallback((): number => {
    return revenue
      .filter(entry => entry.incomeClassification === 'non-qualifying' ||
                      (!entry.incomeClassification && !entry.isExport &&
                       entry.activityType !== 'export-services' &&
                       entry.activityType !== 'intra-zone-trade' &&
                       entry.activityType !== 'qualifying-activities'))
      .reduce((sum, entry) => sum + entry.amount, 0);
  }, [revenue]);

  const getFinancialSummary = useCallback((): FinancialSummary => {
    const summary = {
      totalRevenue: getTotalRevenue(),
      totalExpenses: getTotalExpenses(),
      netIncome: getNetIncome(),
      lastUpdated: new Date().toISOString(),
      isConnected
    };
    console.log('📈 Financial summary generated:', summary);
    return summary;
  }, [getTotalRevenue, getTotalExpenses, getNetIncome, isConnected]);

  const subscribeToUpdates = useCallback((callback: () => void) => {
    console.log('🔔 New subscriber added to finance updates');
    setUpdateCallbacks(prev => new Set([...prev, callback]));

    return () => {
      console.log('🔕 Subscriber removed from finance updates');
      setUpdateCallbacks(prev => {
        const newSet = new Set(prev);
        newSet.delete(callback);
        return newSet;
      });
    };
  }, []);

  const contextValue: FinanceContextType = {
    revenue,
    expenses,
    addRevenue,
    addExpense,
    updateRevenue,
    updateExpense,
    deleteRevenue,
    deleteExpense,
    getTotalRevenue,
    getTotalExpenses,
    getNetIncome,
    getQualifyingIncome,
    getNonQualifyingIncome,
    getFinancialSummary,
    subscribeToUpdates,
    isConnected
  };

  console.log('✅ FinanceProvider context value ready');

  return (
    <FinanceContext.Provider value={contextValue}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    console.error('❌ useFinance must be used within a FinanceProvider');
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  console.log('🎯 useFinance hook accessed successfully');
  return context;
};

export default FinanceContext;