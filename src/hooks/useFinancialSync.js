import { useEffect, useState, useCallback } from 'react';
import { useFinance } from '../context/FinanceContext';
export const useFinancialSync = () => {
    const { subscribeToUpdates, getFinancialSummary, getTotalRevenue, getTotalExpenses, getNetIncome } = useFinance();
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
