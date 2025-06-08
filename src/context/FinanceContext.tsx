
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Types
interface Revenue {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  vatAmount?: number;
}

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  vendor?: string;
  vatAmount?: number;
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
  getFinancialSummary: () => {
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
    lastUpdated: string;
  };
  subscribeToUpdates: (callback: () => void) => () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Sample data for demonstration
const initialRevenue: Revenue[] = [
  {
    id: '1',
    category: 'Product Sales',
    amount: 125000,
    date: '2024-01-15',
    description: 'Q1 Product Sales',
    vatAmount: 6250
  },
  {
    id: '2',
    category: 'Services',
    amount: 75000,
    date: '2024-01-20',
    description: 'Consulting Services',
    vatAmount: 3750
  }
];

const initialExpenses: Expense[] = [
  {
    id: '1',
    category: 'Salaries',
    amount: 45000,
    date: '2024-01-01',
    description: 'Monthly Salaries',
    vendor: 'Payroll Department'
  },
  {
    id: '2',
    category: 'Rent',
    amount: 12000,
    date: '2024-01-01',
    description: 'Office Rent',
    vendor: 'Property Management Co.',
    vatAmount: 600
  }
];

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [revenue, setRevenue] = useState<Revenue[]>(initialRevenue);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [updateCallbacks, setUpdateCallbacks] = useState<Set<() => void>>(new Set());

  // Notify subscribers of updates
  const notifyUpdate = useCallback(() => {
    updateCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.warn('Error in finance update callback:', error);
      }
    });
  }, [updateCallbacks]);

  const addRevenue = useCallback((newRevenue: Omit<Revenue, 'id'>) => {
    try {
      const revenue: Revenue = {
        ...newRevenue,
        id: Date.now().toString()
      };
      setRevenue(prev => [...prev, revenue]);
      notifyUpdate();
    } catch (error) {
      console.error('Error adding revenue:', error);
    }
  }, [notifyUpdate]);

  const addExpense = useCallback((newExpense: Omit<Expense, 'id'>) => {
    try {
      const expense: Expense = {
        ...newExpense,
        id: Date.now().toString()
      };
      setExpenses(prev => [...prev, expense]);
      notifyUpdate();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  }, [notifyUpdate]);

  const updateRevenue = useCallback((id: string, updates: Partial<Revenue>) => {
    try {
      setRevenue(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ));
      notifyUpdate();
    } catch (error) {
      console.error('Error updating revenue:', error);
    }
  }, [notifyUpdate]);

  const updateExpense = useCallback((id: string, updates: Partial<Expense>) => {
    try {
      setExpenses(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ));
      notifyUpdate();
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  }, [notifyUpdate]);

  const deleteRevenue = useCallback((id: string) => {
    try {
      setRevenue(prev => prev.filter(item => item.id !== id));
      notifyUpdate();
    } catch (error) {
      console.error('Error deleting revenue:', error);
    }
  }, [notifyUpdate]);

  const deleteExpense = useCallback((id: string) => {
    try {
      setExpenses(prev => prev.filter(item => item.id !== id));
      notifyUpdate();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  }, [notifyUpdate]);

  const getTotalRevenue = useCallback((): number => {
    try {
      return revenue.reduce((sum, item) => sum + (item.amount || 0), 0);
    } catch (error) {
      console.error('Error calculating total revenue:', error);
      return 0;
    }
  }, [revenue]);

  const getTotalExpenses = useCallback((): number => {
    try {
      return expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
    } catch (error) {
      console.error('Error calculating total expenses:', error);
      return 0;
    }
  }, [expenses]);

  const getNetIncome = useCallback((): number => {
    try {
      return getTotalRevenue() - getTotalExpenses();
    } catch (error) {
      console.error('Error calculating net income:', error);
      return 0;
    }
  }, [getTotalRevenue, getTotalExpenses]);

  const getFinancialSummary = useCallback(() => {
    try {
      return {
        totalRevenue: getTotalRevenue(),
        totalExpenses: getTotalExpenses(),
        netIncome: getNetIncome(),
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting financial summary:', error);
      return {
        totalRevenue: 0,
        totalExpenses: 0,
        netIncome: 0,
        lastUpdated: new Date().toISOString()
      };
    }
  }, [getTotalRevenue, getTotalExpenses, getNetIncome]);

  const subscribeToUpdates = useCallback((callback: () => void) => {
    setUpdateCallbacks(prev => new Set([...prev, callback]));
    
    // Return unsubscribe function
    return () => {
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
    getFinancialSummary,
    subscribeToUpdates
  };

  return (
    <FinanceContext.Provider value={contextValue}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export type { Revenue, Expense, FinanceContextType };
