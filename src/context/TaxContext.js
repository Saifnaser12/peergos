import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useReducer } from 'react';
const TaxContext = createContext(undefined);
const initialState = {
    profile: null,
    revenue: [],
    expenses: [],
    isDraftMode: false,
};
const taxReducer = (state, action) => {
    switch (action.type) {
        case 'SET_PROFILE':
            return {
                ...state,
                profile: action.payload,
            };
        case 'ADD_REVENUE':
            return {
                ...state,
                revenue: [...state.revenue, action.payload],
            };
        case 'ADD_EXPENSE':
            return {
                ...state,
                expenses: [...state.expenses, action.payload],
            };
        case 'UPDATE_REVENUE':
            return {
                ...state,
                revenue: state.revenue.map((item) => item.id === action.payload.id ? action.payload : item),
            };
        case 'UPDATE_EXPENSE':
            return {
                ...state,
                expenses: state.expenses.map((item) => item.id === action.payload.id ? action.payload : item),
            };
        case 'DELETE_REVENUE':
            return {
                ...state,
                revenue: state.revenue.filter((item) => item.id !== action.payload),
            };
        case 'DELETE_EXPENSE':
            return {
                ...state,
                expenses: state.expenses.filter((item) => item.id !== action.payload),
            };
        case 'TOGGLE_DRAFT_MODE':
            return {
                ...state,
                isDraftMode: !state.isDraftMode,
            };
        case 'CLEAR_DRAFT':
            return {
                ...state,
                revenue: [],
                expenses: [],
                isDraftMode: false,
            };
        default:
            return state;
    }
};
export const TaxProvider = ({ children }) => {
    const [state, dispatch] = useReducer(taxReducer, initialState);
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
