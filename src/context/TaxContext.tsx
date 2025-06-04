import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CompanyProfile } from '../types/company';

export interface RevenueEntry {
  id: string;
  date: string;
  amount: number;
  source: string;
  vatAmount: number;
  category: string;
}

export interface ExpenseEntry {
  id: string;
  date: string;
  amount: number;
  description: string;
  vatAmount: number;
  category: string;
}

export interface TaxState {
  profile: CompanyProfile | null;
  revenue: RevenueEntry[];
  expenses: ExpenseEntry[];
  isDraftMode: boolean;
}

type TaxAction =
  | { type: 'SET_PROFILE'; payload: CompanyProfile }
  | { type: 'ADD_REVENUE'; payload: RevenueEntry }
  | { type: 'ADD_EXPENSE'; payload: ExpenseEntry }
  | { type: 'UPDATE_REVENUE'; payload: RevenueEntry }
  | { type: 'UPDATE_EXPENSE'; payload: ExpenseEntry }
  | { type: 'DELETE_REVENUE'; payload: string }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'TOGGLE_DRAFT_MODE' }
  | { type: 'CLEAR_DRAFT' };

interface TaxContextType {
  state: TaxState;
  dispatch: React.Dispatch<TaxAction>;
}

const TaxContext = createContext<TaxContextType | undefined>(undefined);

const initialState: TaxState = {
  profile: null,
  revenue: [],
  expenses: [],
  isDraftMode: false,
};

const taxReducer = (state: TaxState, action: TaxAction): TaxState => {
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
        revenue: state.revenue.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
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

export const TaxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taxReducer, initialState);

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