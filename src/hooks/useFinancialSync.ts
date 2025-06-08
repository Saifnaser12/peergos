import { useState, useEffect, useCallback } from 'react';
import { useFinance } from '../context/FinanceContext';

interface FinancialSyncData {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  lastUpdated: string;
}

export const useFinancialSync = () => {
  const { getFinancialSummary, subscribeToUpdates, getTotalRevenue, getTotalExpenses, getNetIncome } = useFinance();
  const [isUpdating, setIsUpdating] = useState(false);
  const [summary, setSummary] = useState<FinancialSyncData>({
    totalRevenue: 0,
    totalExpenses: 0,
    netIncome: 0,
    lastUpdated: new Date().toISOString()
  });

  const updateSummary = useCallback(() => {
    setIsUpdating(true);

    try {
      const financialSummary = getFinancialSummary();
      setSummary({
        totalRevenue: financialSummary.totalRevenue,
        totalExpenses: financialSummary.totalExpenses,
        netIncome: financialSummary.netIncome,
        lastUpdated: financialSummary.lastUpdated
      });
    } catch (error) {
      console.error('Error updating financial summary:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [getFinancialSummary]);

  useEffect(() => {
    // Initial load
    updateSummary();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToUpdates(updateSummary);

    return unsubscribe;
  }, [updateSummary, subscribeToUpdates]);

  return {
    summary,
    isUpdating,
    totalRevenue: getTotalRevenue(),
    totalExpenses: getTotalExpenses(),
    netIncome: getNetIncome(),
    lastUpdated: summary.lastUpdated
  };
};

export default useFinancialSync;