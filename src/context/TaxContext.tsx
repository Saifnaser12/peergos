import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { CompanyProfile, RevenueEntry, ExpenseEntry } from '../types';

export interface TaxState {
  profile: CompanyProfile | null;
  revenues: RevenueEntry[];
  expenses: ExpenseEntry[];
  isDraftMode: boolean;
}

type TaxAction =
  | { type: 'SET_PROFILE'; payload: CompanyProfile }
  | { type: 'ADD_REVENUE'; payload: RevenueEntry }
  | { type: 'ADD_EXPENSE'; payload: ExpenseEntry }
  | { type: 'ADD_REVENUES'; payload: RevenueEntry[] }
  | { type: 'ADD_EXPENSES'; payload: ExpenseEntry[] }
  | { type: 'SET_STATE'; payload: TaxState }
  | { type: 'TOGGLE_DRAFT_MODE'; payload: boolean }
  | { type: 'LOAD_DRAFT' }
  | { type: 'CLEAR_DRAFT' };

const initialState: TaxState = {
  profile: null,
  revenues: [],
  expenses: [],
  isDraftMode: false
};

const DRAFT_KEY = 'tax_filing_draft';
const SUBMITTED_STATE_KEY = 'taxState';

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
    case 'ADD_REVENUES':
      return { ...state, revenues: [...state.revenues, ...action.payload] };
    case 'ADD_EXPENSES':
      return { ...state, expenses: [...state.expenses, ...action.payload] };
    case 'SET_STATE':
      return action.payload;
    case 'TOGGLE_DRAFT_MODE':
      return { ...state, isDraftMode: action.payload };
    case 'LOAD_DRAFT':
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        const draftState = JSON.parse(savedDraft);
        return { ...draftState, isDraftMode: true };
      }
      return state;
    case 'CLEAR_DRAFT':
      localStorage.removeItem(DRAFT_KEY);
      return initialState;
    default:
      return state;
  }
};

export const TaxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taxReducer, initialState);

  useEffect(() => {
    // Load submitted state from localStorage on mount
    const savedState = localStorage.getItem(SUBMITTED_STATE_KEY);
    if (savedState) {
      dispatch({ type: 'SET_STATE', payload: JSON.parse(savedState) });
    }

    // Check for existing draft
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      const draftState = JSON.parse(savedDraft);
      if (draftState.isDraftMode) {
        dispatch({ type: 'LOAD_DRAFT' });
      }
    }
  }, []);

  useEffect(() => {
    // Save to appropriate storage based on draft mode
    if (state.isDraftMode) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
    } else {
      localStorage.setItem(SUBMITTED_STATE_KEY, JSON.stringify(state));
    }
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