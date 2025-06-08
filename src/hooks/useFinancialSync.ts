
import { useEffect, useState, useCallback } from 'react';
import { useFinance } from '../context/FinanceContext';

export const useFinancialSync = () => {
  const { 
    subscribeToUpdates, 
    getFinancialSummary,
    getTotalRevenue,
    getTotalExpenses,
    getNetIncome
  } = useFinance();
  
  const [summary, setSummary] = useState(getFinancialSummary());
  const [isUpdating, setIsUpdating] = useState(false);

  const refreshSummary = useCallback(() => {
    setIsUpdating(true);
    const newSummary = getFinancialSummary();
    setSummary(newSummary);
    
    // Brief loading state for visual feedback
    setTimeout(() => setIsUpdating(false), 100);
  }, [getFinancialSummary]);

  useEffect(() => {
    // Subscribe to finance updates
    const unsubscribe = subscribeToUpdates(refreshSummary);
    
    // Initial load
    refreshSummary();
    
    return unsubscribe;
  }, [subscribeToUpdates, refreshSummary]);

  return {
    summary,
    isUpdating,
    refreshSummary,
    // Direct access to current values
    totalRevenue: getTotalRevenue(),
    totalExpenses: getTotalExpenses(),
    netIncome: getNetIncome()
  };
};

export default useFinancialSync;
import { useState, useEffect, useCallback } from 'react';
import { useFinance } from '../context/FinanceContext';

interface FinancialSyncData {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  lastUpdated: string;
}

export const useFinancialSync = () => {
  const { getFinancialSummary, subscribeToUpdates } = useFinance();
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
    totalRevenue: summary.totalRevenue,
    totalExpenses: summary.totalExpenses,
    netIncome: summary.netIncome,
    lastUpdated: summary.lastUpdated
  };
};

export default useFinancialSync;
