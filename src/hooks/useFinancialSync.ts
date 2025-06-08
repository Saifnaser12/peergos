
import { useState, useEffect, useCallback } from 'react';
import { useFinance } from '../context/FinanceContext';

interface FinancialSyncData {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  lastUpdated: string;
}

export const useFinancialSync = () => {
  const finance = useFinance();
  const [isUpdating, setIsUpdating] = useState(false);
  const [summary, setSummary] = useState<FinancialSyncData>({
    totalRevenue: 0,
    totalExpenses: 0,
    netIncome: 0,
    lastUpdated: new Date().toISOString()
  });

  const updateSummary = useCallback(() => {
    if (!finance) return;
    
    setIsUpdating(true);
    
    try {
      const totalRevenue = finance.getTotalRevenue();
      const totalExpenses = finance.getTotalExpenses();
      const netIncome = finance.getNetIncome();
      
      setSummary({
        totalRevenue,
        totalExpenses,
        netIncome,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating financial summary:', error);
    } finally {
      setTimeout(() => setIsUpdating(false), 100);
    }
  }, [finance]);

  useEffect(() => {
    if (!finance) return;

    // Initial load
    updateSummary();

    // Subscribe to updates
    const unsubscribe = finance.subscribeToUpdates(updateSummary);
    
    return unsubscribe;
  }, [finance, updateSummary]);

  return {
    summary,
    isUpdating,
    totalRevenue: summary.totalRevenue,
    totalExpenses: summary.totalExpenses,
    netIncome: summary.netIncome,
    lastUpdated: summary.lastUpdated
  };
};

export default useFinancialSync;
