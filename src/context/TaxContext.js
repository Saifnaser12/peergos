import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useReducer, useEffect } from 'react';
import { SecureStorage } from '../utils/storage';
const TaxContext = createContext(undefined);
const initialState = {
    revenues: [],
    expenses: [],
    isDraftMode: false
};
function taxReducer(state, action) {
    switch (action.type) {
        case 'SET_TAX_DATA':
            return action.payload;
        case 'ADD_REVENUE':
            return {
                ...state,
                revenues: [...state.revenues, action.payload]
            };
        case 'ADD_EXPENSE':
            return {
                ...state,
                expenses: [...state.expenses, action.payload]
            };
        case 'UPDATE_REVENUE':
            return {
                ...state,
                revenues: state.revenues.map(revenue => revenue.id === action.payload.id
                    ? { ...revenue, ...action.payload.data }
                    : revenue)
            };
        case 'UPDATE_EXPENSE':
            return {
                ...state,
                expenses: state.expenses.map(expense => expense.id === action.payload.id
                    ? { ...expense, ...action.payload.data }
                    : expense)
            };
        case 'DELETE_REVENUE':
            return {
                ...state,
                revenues: state.revenues.filter(revenue => revenue.id !== action.payload)
            };
        case 'DELETE_EXPENSE':
            return {
                ...state,
                expenses: state.expenses.filter(expense => expense.id !== action.payload)
            };
        case 'TOGGLE_DRAFT_MODE':
            return {
                ...state,
                isDraftMode: action.payload
            };
        case 'CLEAR_DRAFT':
            return {
                ...state,
                revenues: [],
                expenses: [],
                isDraftMode: false
            };
        default:
            return state;
    }
}
export const TaxProvider = ({ children }) => {
    const [state, dispatch] = useReducer(taxReducer, initialState);
    useEffect(() => {
        // Load initial data from storage
        const storedData = SecureStorage.get('taxData');
        if (storedData) {
            dispatch({ type: 'SET_TAX_DATA', payload: storedData });
        }
    }, []);
    useEffect(() => {
        // Save state changes to storage
        SecureStorage.set('taxData', state);
    }, [state]);
    return (_jsx(TaxContext.Provider, { value: { state, dispatch }, children: children }));
};
export const useTax = () => {
    const context = useContext(TaxContext);
    if (context === undefined) {
        throw new Error('useTax must be used within a TaxProvider');
    }
    return context;
};
export const calculateVAT = (amount, vatIncluded = false) => {
    if (vatIncluded) {
        return (amount * 5) / 105; // VAT amount when price includes VAT
    }
    return amount * 0.05; // VAT amount when price excludes VAT
};
export const calculateCIT = (taxableIncome) => {
    if (taxableIncome <= 375000) {
        return 0;
    }
    return (taxableIncome - 375000) * 0.09;
};
