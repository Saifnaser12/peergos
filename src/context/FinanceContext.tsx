
import React, { createContext, useContext, useState, useEffect } from "react";

type Revenue = { 
  id: string;
  amount: number; 
  description: string; 
  date: string;
  category?: string;
};

type Expense = { 
  id: string;
  amount: number; 
  category: string; 
  date: string; 
  description?: string;
  vendor?: string;
};

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
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [revenue, setRevenue] = useState<Revenue[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedRevenue = localStorage.getItem('peergos-revenue');
    const savedExpenses = localStorage.getItem('peergos-expenses');
    
    if (savedRevenue) {
      try {
        setRevenue(JSON.parse(savedRevenue));
      } catch (error) {
        console.error('Error loading revenue from localStorage:', error);
      }
    }
    
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (error) {
        console.error('Error loading expenses from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('peergos-revenue', JSON.stringify(revenue));
  }, [revenue]);

  useEffect(() => {
    localStorage.setItem('peergos-expenses', JSON.stringify(expenses));
  }, [expenses]);

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const addRevenue = (r: Omit<Revenue, 'id'>) => {
    const newRevenue = { ...r, id: generateId() };
    setRevenue(prev => [...prev, newRevenue]);
  };

  const addExpense = (e: Omit<Expense, 'id'>) => {
    const newExpense = { ...e, id: generateId() };
    setExpenses(prev => [...prev, newExpense]);
  };

  const updateRevenue = (id: string, updates: Partial<Revenue>) => {
    setRevenue(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteRevenue = (id: string) => {
    setRevenue(prev => prev.filter(r => r.id !== id));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const getTotalRevenue = () => {
    return revenue.reduce((sum, r) => sum + r.amount, 0);
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  };

  const getNetIncome = () => {
    return getTotalRevenue() - getTotalExpenses();
  };

  return (
    <FinanceContext.Provider value={{ 
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
      getNetIncome
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("FinanceContext must be used within FinanceProvider");
  return ctx;
};
