
import { useState, useEffect, useCallback, useRef } from 'react';
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

  // Use ref to prevent infinite re-renders
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateSummary = useCallback(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    setIsUpdating(true);

    updateTimeoutRef.current = setTimeout(() => {
      try {
        const financialSummary = finance.getFinancialSummary();
        setSummary({
          totalRevenue: financialSummary.totalRevenue,
          totalExpenses: financialSummary.totalExpenses,
          netIncome: financialSummary.netIncome,
          lastUpdated: financialSummary.lastUpdated
        });
      } catch (error) {
        console.error('Error updating financial summary:', error);
        // Set default values on error
        setSummary({
          totalRevenue: 0,
          totalExpenses: 0,
          netIncome: 0,
          lastUpdated: new Date().toISOString()
        });
      } finally {
        setIsUpdating(false);
      }
    }, 100);
  }, [finance]);

  useEffect(() => {
    // Initial load
    updateSummary();

    // Subscribe to real-time updates
    const unsubscribe = finance.subscribeToUpdates(updateSummary);

    return () => {
      unsubscribe();
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [updateSummary, finance]);

  return {
    summary,
    isUpdating,
    totalRevenue: finance.getTotalRevenue(),
    totalExpenses: finance.getTotalExpenses(),
    netIncome: finance.getNetIncome(),
    lastUpdated: summary.lastUpdated
  };
};

export default useFinancialSync;
