import { useState, useEffect, useCallback } from 'react';

interface FinancialSyncData {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  lastUpdated: string;
}

export const useFinancialSync = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [summary, setSummary] = useState<FinancialSyncData>({
    totalRevenue: 200000,
    totalExpenses: 57000,
    netIncome: 143000,
    lastUpdated: new Date().toISOString()
  });

  const updateSummary = useCallback(() => {
    setIsUpdating(true);

    try {
      // Mock update - in real app this would sync with FinanceContext
      setTimeout(() => {
        setSummary({
          totalRevenue: 200000,
          totalExpenses: 57000,
          netIncome: 143000,
          lastUpdated: new Date().toISOString()
        });
        setIsUpdating(false);
      }, 500);
    } catch (error) {
      console.error('Error updating financial summary:', error);
      setIsUpdating(false);
    }
  }, []);

  useEffect(() => {
    updateSummary();
  }, [updateSummary]);

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