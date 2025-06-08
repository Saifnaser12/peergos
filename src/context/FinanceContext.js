import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
const FinanceContext = createContext(undefined);
export const FinanceProvider = ({ children }) => {
    const [revenue, setRevenue] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [updateCallbacks, setUpdateCallbacks] = useState(new Set());
    const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());
    // Trigger all subscribed callbacks when data changes
    const triggerUpdates = useCallback(() => {
        const timestamp = new Date().toISOString();
        setLastUpdated(timestamp);
        updateCallbacks.forEach(callback => {
            try {
                callback();
            }
            catch (error) {
                console.error('Error in finance update callback:', error);
            }
        });
    }, [updateCallbacks]);
    // Load data from localStorage on mount
    useEffect(() => {
        const savedRevenue = localStorage.getItem('peergos-revenue');
        const savedExpenses = localStorage.getItem('peergos-expenses');
        if (savedRevenue) {
            try {
                setRevenue(JSON.parse(savedRevenue));
            }
            catch (error) {
                console.error('Error loading revenue from localStorage:', error);
            }
        }
        if (savedExpenses) {
            try {
                setExpenses(JSON.parse(savedExpenses));
            }
            catch (error) {
                console.error('Error loading expenses from localStorage:', error);
            }
        }
    }, []);
    // Save to localStorage and trigger updates whenever data changes
    useEffect(() => {
        localStorage.setItem('peergos-revenue', JSON.stringify(revenue));
        triggerUpdates();
    }, [revenue, triggerUpdates]);
    useEffect(() => {
        localStorage.setItem('peergos-expenses', JSON.stringify(expenses));
        triggerUpdates();
    }, [expenses, triggerUpdates]);
    const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const addRevenue = useCallback((r) => {
        const newRevenue = { ...r, id: generateId() };
        setRevenue(prev => [...prev, newRevenue]);
    }, []);
    const addExpense = useCallback((e) => {
        const newExpense = { ...e, id: generateId() };
        setExpenses(prev => [...prev, newExpense]);
    }, []);
    const updateRevenue = useCallback((id, updates) => {
        setRevenue(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    }, []);
    const updateExpense = useCallback((id, updates) => {
        setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    }, []);
    const deleteRevenue = useCallback((id) => {
        setRevenue(prev => prev.filter(r => r.id !== id));
    }, []);
    const deleteExpense = useCallback((id) => {
        setExpenses(prev => prev.filter(e => e.id !== id));
    }, []);
    const getTotalRevenue = useCallback(() => {
        return revenue.reduce((sum, r) => sum + r.amount, 0);
    }, [revenue]);
    const getTotalExpenses = useCallback(() => {
        return expenses.reduce((sum, e) => sum + e.amount, 0);
    }, [expenses]);
    const getNetIncome = useCallback(() => {
        return getTotalRevenue() - getTotalExpenses();
    }, [getTotalRevenue, getTotalExpenses]);
    const subscribeToUpdates = useCallback((callback) => {
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
            revenueCount: revenue.length,
            expenseCount: expenses.length,
            lastUpdated
        };
    }, [getTotalRevenue, getTotalExpenses, getNetIncome, revenue.length, expenses.length, lastUpdated]);
    return (_jsx(FinanceContext.Provider, { value: {
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
            subscribeToUpdates,
            getFinancialSummary
        }, children: children }));
};
export const useFinance = () => {
    const ctx = useContext(FinanceContext);
    if (!ctx)
        throw new Error("FinanceContext must be used within FinanceProvider");
    return ctx;
};
