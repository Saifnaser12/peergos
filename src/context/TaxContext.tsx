import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { SecureStorage } from '../utils/storage';

export interface RevenueEntry {
  id: string;
  date: string;
  amount: number;
  source: string;
  vatAmount: number;
}

export interface ExpenseEntry {
  id: string;
  date: string;
  amount: number;
  category: string;
}

interface TaxState {
  revenues: RevenueEntry[];
  expenses: ExpenseEntry[];
}

type TaxAction =
  | { type: 'SET_TAX_DATA'; payload: TaxState }
  | { type: 'ADD_REVENUE'; payload: RevenueEntry }
  | { type: 'ADD_EXPENSE'; payload: ExpenseEntry }
  | { type: 'UPDATE_REVENUE'; payload: { id: string; data: Partial<RevenueEntry> } }
  | { type: 'UPDATE_EXPENSE'; payload: { id: string; data: Partial<ExpenseEntry> } }
  | { type: 'DELETE_REVENUE'; payload: string }
  | { type: 'DELETE_EXPENSE'; payload: string };

interface TaxContextType {
  state: TaxState;
  dispatch: React.Dispatch<TaxAction>;
}

const TaxContext = createContext<TaxContextType | undefined>(undefined);

const initialState: TaxState = {
  revenues: [],
  expenses: []
};

function taxReducer(state: TaxState, action: TaxAction): TaxState {
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
        revenues: state.revenues.map(revenue =>
          revenue.id === action.payload.id
            ? { ...revenue, ...action.payload.data }
            : revenue
        )
      };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.id === action.payload.id
            ? { ...expense, ...action.payload.data }
            : expense
        )
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
    default:
      return state;
  }
}

export const TaxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taxReducer, initialState);

  useEffect(() => {
    // Load initial data from storage
    const storedData = SecureStorage.get<TaxState>('taxData');
    if (storedData) {
      dispatch({ type: 'SET_TAX_DATA', payload: storedData });
    }
  }, []);

  useEffect(() => {
    // Save state changes to storage
    SecureStorage.set('taxData', state);
  }, [state]);

  return (
    <TaxContext.Provider value={{ state, dispatch }}>
      {children}
    </TaxContext.Provider>
  );
};

export const useTax = () => {
  const context = useContext(TaxContext);
  if (context === undefined) {
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