import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback } from 'react';
const FinanceContext = createContext(undefined);
// Sample data
const initialRevenue = [
    {
        id: '1',
        category: 'Product Sales',
        amount: 150000,
        date: '2024-01-15',
        description: 'Q1 Product Sales Revenue',
        customer: 'ABC Corp',
        vatAmount: 7500
    },
    {
        id: '2',
        category: 'Services',
        amount: 85000,
        date: '2024-01-20',
        description: 'Consulting and Professional Services',
        customer: 'XYZ Ltd',
        vatAmount: 4250
    },
    {
        id: '3',
        category: 'Licensing',
        amount: 25000,
        date: '2024-01-25',
        description: 'Software Licensing Revenue',
        vatAmount: 1250
    }
];
const initialExpenses = [
    {
        id: '1',
        category: 'Salaries',
        amount: 65000,
        date: '2024-01-01',
        description: 'Monthly Staff Salaries',
        vendor: 'Payroll Department'
    },
    {
        id: '2',
        category: 'Rent',
        amount: 18000,
        date: '2024-01-01',
        description: 'Office Space Rental',
        vendor: 'Property Management Co.',
        vatAmount: 900
    },
    {
        id: '3',
        category: 'Utilities',
        amount: 4500,
        date: '2024-01-05',
        description: 'Electricity and Internet',
        vendor: 'Utility Company',
        vatAmount: 225
    },
    {
        id: '4',
        category: 'Marketing',
        amount: 12000,
        date: '2024-01-10',
        description: 'Digital Marketing Campaign',
        vendor: 'Marketing Agency',
        vatAmount: 600
    }
];
export const FinanceProvider = ({ children }) => {
    console.log('🏦 FinanceProvider initializing...');
    const [revenue, setRevenue] = useState(initialRevenue);
    const [expenses, setExpenses] = useState(initialExpenses);
    const [updateCallbacks, setUpdateCallbacks] = useState(new Set());
    const [isConnected] = useState(true);
    console.log('📊 Finance data initialized:', {
        revenueCount: revenue.length,
        expenseCount: expenses.length
    });
    // Notify subscribers of updates
    const notifyUpdate = useCallback(() => {
        console.log('🔄 Notifying finance update subscribers...');
        updateCallbacks.forEach(callback => {
            try {
                callback();
            }
            catch (error) {
                console.warn('⚠️ Error in finance update callback:', error);
            }
        });
    }, [updateCallbacks]);
    const addRevenue = useCallback((newRevenue) => {
        try {
            const revenue = {
                ...newRevenue,
                id: Date.now().toString()
            };
            console.log('💰 Adding revenue:', revenue);
            setRevenue(prev => [...prev, revenue]);
            notifyUpdate();
        }
        catch (error) {
            console.error('❌ Error adding revenue:', error);
        }
    }, [notifyUpdate]);
    const addExpense = useCallback((newExpense) => {
        try {
            const expense = {
                ...newExpense,
                id: Date.now().toString()
            };
            console.log('💸 Adding expense:', expense);
            setExpenses(prev => [...prev, expense]);
            notifyUpdate();
        }
        catch (error) {
            console.error('❌ Error adding expense:', error);
        }
    }, [notifyUpdate]);
    const updateRevenue = useCallback((id, updates) => {
        setRevenue(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
        notifyUpdate();
    }, [notifyUpdate]);
    const updateExpense = useCallback((id, updates) => {
        setExpenses(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
        notifyUpdate();
    }, [notifyUpdate]);
    const deleteRevenue = useCallback((id) => {
        setRevenue(prev => prev.filter(item => item.id !== id));
        notifyUpdate();
    }, [notifyUpdate]);
    const deleteExpense = useCallback((id) => {
        setExpenses(prev => prev.filter(item => item.id !== id));
        notifyUpdate();
    }, [notifyUpdate]);
    const getTotalRevenue = useCallback(() => {
        const total = revenue.reduce((sum, item) => sum + (item.amount || 0), 0);
        console.log('💰 Total revenue calculated:', total);
        return total;
    }, [revenue]);
    const getTotalExpenses = useCallback(() => {
        const total = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
        console.log('💸 Total expenses calculated:', total);
        return total;
    }, [expenses]);
    const getNetIncome = useCallback(() => {
        const net = getTotalRevenue() - getTotalExpenses();
        console.log('💎 Net income calculated:', net);
        return net;
    }, [getTotalRevenue, getTotalExpenses]);
    const getFinancialSummary = useCallback(() => {
        const summary = {
            totalRevenue: getTotalRevenue(),
            totalExpenses: getTotalExpenses(),
            netIncome: getNetIncome(),
            lastUpdated: new Date().toISOString(),
            isConnected
        };
        console.log('📈 Financial summary generated:', summary);
        return summary;
    }, [getTotalRevenue, getTotalExpenses, getNetIncome, isConnected]);
    const subscribeToUpdates = useCallback((callback) => {
        console.log('🔔 New subscriber added to finance updates');
        setUpdateCallbacks(prev => new Set([...prev, callback]));
        return () => {
            console.log('🔕 Subscriber removed from finance updates');
            setUpdateCallbacks(prev => {
                const newSet = new Set(prev);
                newSet.delete(callback);
                return newSet;
            });
        };
    }, []);
    const contextValue = {
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
        subscribeToUpdates,
        isConnected
    };
    console.log('✅ FinanceProvider context value ready');
    return (_jsx(FinanceContext.Provider, { value: contextValue, children: children }));
};
export const useFinance = () => {
    const context = useContext(FinanceContext);
    if (!context) {
        console.error('❌ useFinance must be used within a FinanceProvider');
        throw new Error('useFinance must be used within a FinanceProvider');
    }
    console.log('🎯 useFinance hook accessed successfully');
    return context;
};
export default FinanceContext;
