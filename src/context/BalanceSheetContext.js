import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useReducer, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AccountType, AccountCategory } from '../types/financials';
// Initial state
const initialState = {
    accounts: [],
    journalEntries: [],
    currentBalanceSheet: null,
    loading: false,
    error: null
};
// Reducer
const balanceSheetReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'ADD_ACCOUNT':
            return { ...state, accounts: [...state.accounts, action.payload] };
        case 'UPDATE_ACCOUNT':
            return {
                ...state,
                accounts: state.accounts.map(acc => acc.id === action.payload.id ? action.payload : acc)
            };
        case 'DELETE_ACCOUNT':
            return {
                ...state,
                accounts: state.accounts.filter(acc => acc.id !== action.payload)
            };
        case 'ADD_JOURNAL_ENTRY':
            return {
                ...state,
                journalEntries: [...state.journalEntries, action.payload]
            };
        case 'UPDATE_JOURNAL_ENTRY':
            return {
                ...state,
                journalEntries: state.journalEntries.map(entry => entry.id === action.payload.id ? action.payload : entry)
            };
        case 'DELETE_JOURNAL_ENTRY':
            return {
                ...state,
                journalEntries: state.journalEntries.filter(entry => entry.id !== action.payload)
            };
        case 'SET_BALANCE_SHEET':
            return { ...state, currentBalanceSheet: action.payload };
        default:
            return state;
    }
};
const BalanceSheetContext = createContext(undefined);
// Provider component
export const BalanceSheetProvider = ({ children }) => {
    const [state, dispatch] = useReducer(balanceSheetReducer, initialState);
    const addAccount = useCallback((account) => {
        const newAccount = {
            ...account,
            id: uuidv4()
        };
        dispatch({ type: 'ADD_ACCOUNT', payload: newAccount });
    }, []);
    const updateAccount = useCallback((account) => {
        dispatch({ type: 'UPDATE_ACCOUNT', payload: account });
    }, []);
    const deleteAccount = useCallback((id) => {
        dispatch({ type: 'DELETE_ACCOUNT', payload: id });
    }, []);
    const addJournalEntry = useCallback((entry) => {
        const now = new Date().toISOString();
        const newEntry = {
            ...entry,
            id: uuidv4(),
            createdAt: now,
            updatedAt: now
        };
        if (validateDoubleEntry(entry.debitAccountId, entry.creditAccountId, entry.amount)) {
            dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: newEntry });
            // Update account balances
            const debitAccount = state.accounts.find(acc => acc.id === entry.debitAccountId);
            const creditAccount = state.accounts.find(acc => acc.id === entry.creditAccountId);
            if (debitAccount && creditAccount) {
                updateAccount({
                    ...debitAccount,
                    balance: debitAccount.balance + entry.amount
                });
                updateAccount({
                    ...creditAccount,
                    balance: creditAccount.balance - entry.amount
                });
            }
        }
    }, [state.accounts]);
    const updateJournalEntry = useCallback((entry) => {
        dispatch({ type: 'UPDATE_JOURNAL_ENTRY', payload: entry });
    }, []);
    const deleteJournalEntry = useCallback((id) => {
        dispatch({ type: 'DELETE_JOURNAL_ENTRY', payload: id });
    }, []);
    const validateDoubleEntry = useCallback((debitAccountId, creditAccountId, amount) => {
        const debitAccount = state.accounts.find(acc => acc.id === debitAccountId);
        const creditAccount = state.accounts.find(acc => acc.id === creditAccountId);
        if (!debitAccount || !creditAccount) {
            dispatch({ type: 'SET_ERROR', payload: 'Invalid account IDs' });
            return false;
        }
        if (amount <= 0) {
            dispatch({ type: 'SET_ERROR', payload: 'Amount must be positive' });
            return false;
        }
        return true;
    }, [state.accounts]);
    const generateBalanceSheet = useCallback(() => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const balanceSheet = {
                asOf: new Date().toISOString(),
                assets: {
                    currentAssets: state.accounts.filter(acc => acc.type === AccountType.ASSET && acc.category === AccountCategory.CURRENT_ASSETS),
                    fixedAssets: state.accounts.filter(acc => acc.type === AccountType.ASSET && acc.category === AccountCategory.FIXED_ASSETS),
                    intangibleAssets: state.accounts.filter(acc => acc.type === AccountType.ASSET && acc.category === AccountCategory.INTANGIBLE_ASSETS),
                    otherAssets: state.accounts.filter(acc => acc.type === AccountType.ASSET && acc.category === AccountCategory.OTHER_ASSETS),
                    totalAssets: state.accounts
                        .filter(acc => acc.type === AccountType.ASSET)
                        .reduce((sum, acc) => sum + acc.balance, 0)
                },
                liabilities: {
                    currentLiabilities: state.accounts.filter(acc => acc.type === AccountType.LIABILITY && acc.category === AccountCategory.CURRENT_LIABILITIES),
                    longTermLiabilities: state.accounts.filter(acc => acc.type === AccountType.LIABILITY && acc.category === AccountCategory.LONG_TERM_LIABILITIES),
                    otherLiabilities: state.accounts.filter(acc => acc.type === AccountType.LIABILITY && acc.category === AccountCategory.OTHER_LIABILITIES),
                    totalLiabilities: state.accounts
                        .filter(acc => acc.type === AccountType.LIABILITY)
                        .reduce((sum, acc) => sum + acc.balance, 0)
                },
                equity: {
                    shareCapital: state.accounts.filter(acc => acc.type === AccountType.EQUITY && acc.category === AccountCategory.SHARE_CAPITAL),
                    retainedEarnings: state.accounts.filter(acc => acc.type === AccountType.EQUITY && acc.category === AccountCategory.RETAINED_EARNINGS),
                    reserves: state.accounts.filter(acc => acc.type === AccountType.EQUITY && acc.category === AccountCategory.RESERVES),
                    totalEquity: state.accounts
                        .filter(acc => acc.type === AccountType.EQUITY)
                        .reduce((sum, acc) => sum + acc.balance, 0)
                },
                totalLiabilitiesAndEquity: state.accounts
                    .filter(acc => acc.type === AccountType.LIABILITY || acc.type === AccountType.EQUITY)
                    .reduce((sum, acc) => sum + acc.balance, 0)
            };
            dispatch({ type: 'SET_BALANCE_SHEET', payload: balanceSheet });
        }
        catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Error generating balance sheet' });
        }
        finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [state.accounts]);
    return (_jsx(BalanceSheetContext.Provider, { value: {
            ...state,
            addAccount,
            updateAccount,
            deleteAccount,
            addJournalEntry,
            updateJournalEntry,
            deleteJournalEntry,
            generateBalanceSheet,
            validateDoubleEntry
        }, children: children }));
};
// Custom hook
export const useBalanceSheet = () => {
    const context = useContext(BalanceSheetContext);
    if (context === undefined) {
        throw new Error('useBalanceSheet must be used within a BalanceSheetProvider');
    }
    return context;
};
