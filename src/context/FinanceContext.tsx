
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type Revenue = { 
  id: string;
  amount: number; 
  description: string; 
  date: string;
  category?: string;
  freeZoneIncomeType?: 'qualifying' | 'non-qualifying';
};

type Expense = { 
  id: string;
  amount: number; 
  category: string; 
  date: string; 
  description?: string;
  vendor?: string;
};

type FinanceUpdateCallback = () => void;

interface FinanceContextType {
  revenue: Revenue[];
  expenses: Expense[];
  addRevenue: (r: Omit<Revenue, 'id'>) => void;
  addExpense: (e: Omit<Expense, 'id'>) => void;
  updateRevenue: (id: string, r: Partial<Revenue>) => void;
  updateExpense: (id: string, e: Partial<Expense>) => void;
  deleteRevenue: (id: string) => void;
  deleteExpense: (id: string) => void;
  getTotalRevenue: () => number;
  getTotalExpenses: () => number;
  getNetIncome: () => number;
  subscribeToUpdates: (callback: FinanceUpdateCallback) => () => void;
  getFinancialSummary: () => {
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
    revenueCount: number;
    expenseCount: number;
    lastUpdated: string;
  };
  getQualifyingIncome: () => number;
  getNonQualifyingIncome: () => number;
  getNonQualifyingPercentage: () => number;
  checkDeMinimisThreshold: () => {
    exceedsPercentage: boolean;
    exceedsAmount: boolean;
    percentage: number;
    amount: number;
    isCompliant: boolean;
  };
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [updateCallbacks, setUpdateCallbacks] = useState<Set<FinanceUpdateCallback>>(new Set());
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [isInitialized, setIsInitialized] = useState(false);

  // Trigger all subscribed callbacks when data changes
  const triggerUpdates = useCallback(() => {
    const timestamp = new Date().toISOString();
    setLastUpdated(timestamp);
    
    // Use setTimeout to prevent infinite loops
    setTimeout(() => {
      updateCallbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('Error in finance update callback:', error);
        }
      });
    }, 0);
  }, [updateCallbacks]);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedRevenue = localStorage.getItem('peergos-revenue');
      const savedExpenses = localStorage.getItem('peergos-expenses');

      if (savedRevenue) {
        const parsedRevenue = JSON.parse(savedRevenue);
        setRevenues(Array.isArray(parsedRevenue) ? parsedRevenue : []);
      }

      if (savedExpenses) {
        const parsedExpenses = JSON.parse(savedExpenses);
        setExpenses(Array.isArray(parsedExpenses) ? parsedExpenses : []);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      setRevenues([]);
      setExpenses([]);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage and trigger updates whenever data changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('peergos-revenue', JSON.stringify(revenues));
        triggerUpdates();
      } catch (error) {
        console.error('Error saving revenue to localStorage:', error);
      }
    }
  }, [revenues, triggerUpdates, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('peergos-expenses', JSON.stringify(expenses));
        triggerUpdates();
      } catch (error) {
        console.error('Error saving expenses to localStorage:', error);
      }
    }
  }, [expenses, triggerUpdates, isInitialized]);

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const addRevenue = useCallback((r: Omit<Revenue, 'id'>) => {
    const newRevenue = { ...r, id: generateId() };
    setRevenues(prev => [...prev, newRevenue]);
  }, []);

  const addExpense = useCallback((e: Omit<Expense, 'id'>) => {
    const newExpense = { ...e, id: generateId() };
    setExpenses(prev => [...prev, newExpense]);
  }, []);

  const updateRevenue = useCallback((id: string, updates: Partial<Revenue>) => {
    setRevenues(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  }, []);

  const updateExpense = useCallback((id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, []);

  const deleteRevenue = useCallback((id: string) => {
    setRevenues(prev => prev.filter(r => r.id !== id));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  const getTotalRevenue = useCallback(() => {
    return revenues.reduce((sum, r) => sum + (r.amount || 0), 0);
  }, [revenues]);

  const getTotalExpenses = useCallback(() => {
    return expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  }, [expenses]);

  const getNetIncome = useCallback(() => {
    return getTotalRevenue() - getTotalExpenses();
  }, [getTotalRevenue, getTotalExpenses]);

  // Free Zone Income Analytics
  const getQualifyingIncome = useCallback(() => {
    return revenues
      .filter(item => item.freeZoneIncomeType === 'qualifying')
      .reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [revenues]);

  const getNonQualifyingIncome = useCallback(() => {
    return revenues
      .filter(item => item.freeZoneIncomeType === 'non-qualifying')
      .reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [revenues]);

  const getNonQualifyingPercentage = useCallback(() => {
    const totalRevenue = getTotalRevenue();
    const nonQualifying = getNonQualifyingIncome();
    return totalRevenue > 0 ? (nonQualifying / totalRevenue) * 100 : 0;
  }, [getTotalRevenue, getNonQualifyingIncome]);

  const checkDeMinimisThreshold = useCallback(() => {
    const nonQualifying = getNonQualifyingIncome();
    const percentage = getNonQualifyingPercentage();

    return {
      exceedsPercentage: percentage > 5,
      exceedsAmount: nonQualifying > 5000000,
      percentage,
      amount: nonQualifying,
      isCompliant: percentage <= 5 && nonQualifying <= 5000000
    };
  }, [getNonQualifyingIncome, getNonQualifyingPercentage]);

  const subscribeToUpdates = useCallback((callback: FinanceUpdateCallback) => {
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

  const getFinancialSummary = useCallback(() => {
    return {
      totalRevenue: getTotalRevenue(),
      totalExpenses: getTotalExpenses(),
      netIncome: getNetIncome(),
      revenueCount: revenues.length,
      expenseCount: expenses.length,
      lastUpdated
    };
  }, [getTotalRevenue, getTotalExpenses, getNetIncome, revenues.length, expenses.length, lastUpdated]);

  // Don't render until initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <FinanceContext.Provider value={{ 
      revenue: revenues, 
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
      subscribeToUpdates,
      getFinancialSummary,
      getQualifyingIncome,
      getNonQualifyingIncome,
      getNonQualifyingPercentage,
      checkDeMinimisThreshold
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("FinanceContext must be used within FinanceProvider");
  
  // Add backwards compatibility for revenue vs revenues naming
  return {
    ...ctx,
    revenues: ctx.revenue // Alias for backwards compatibility
  };
};
