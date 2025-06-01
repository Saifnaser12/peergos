import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { TaxState, CompanyProfile, RevenueEntry, ExpenseEntry } from '../types';

type TaxAction =
  | { type: 'SET_PROFILE'; payload: CompanyProfile }
  | { type: 'ADD_REVENUE'; payload: RevenueEntry }
  | { type: 'ADD_EXPENSE'; payload: ExpenseEntry }
  | { type: 'SET_STATE'; payload: TaxState };

const initialState: TaxState = {
  profile: null,
  revenues: [],
  expenses: []
};

const TaxContext = createContext<{
  state: TaxState;
  dispatch: React.Dispatch<TaxAction>;
} | null>(null);

const taxReducer = (state: TaxState, action: TaxAction): TaxState => {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'ADD_REVENUE':
      return { ...state, revenues: [...state.revenues, action.payload] };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'SET_STATE':
      return action.payload;
    default:
      return state;
  }
};

export const TaxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taxReducer, initialState);

  useEffect(() => {
    // Load state from localStorage on mount
    const savedState = localStorage.getItem('taxState');
    if (savedState) {
      dispatch({ type: 'SET_STATE', payload: JSON.parse(savedState) });
    }
  }, []);

  useEffect(() => {
    // Save state to localStorage whenever it changes
    localStorage.setItem('taxState', JSON.stringify(state));
  }, [state]);

  return (
    <TaxContext.Provider value={{ state, dispatch }}>
      {children}
    </TaxContext.Provider>
  );
};

export const useTax = () => {
  const context = useContext(TaxContext);
  if (!context) {
    throw new Error('useTax must be used within a TaxProvider');
  }
  return context;
};

export const calculateVAT = (amount: number, vatIncluded: boolean = false): number => {
  if (vatIncluded) {
    return (amount * 5) / 105; // VAT amount when price includes VAT
  }
  return amount * 0.05; // VAT amount when price excludes VAT
};

export const calculateCIT = (taxableIncome: number): number => {
  if (taxableIncome <= 375000) {
    return 0;
  }
  return (taxableIncome - 375000) * 0.09;
}; 