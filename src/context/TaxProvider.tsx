
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface TaxState {
  vatRate: number;
  citRate: number;
  smallBusinessThreshold: number;
  vatThreshold: number;
}

interface TaxAction {
  type: 'UPDATE_RATES' | 'RESET';
  payload?: Partial<TaxState>;
}

const initialState: TaxState = {
  vatRate: 0.05, // 5%
  citRate: 0.09, // 9%
  smallBusinessThreshold: 375000, // AED
  vatThreshold: 375000, // AED
};

const TaxContext = createContext<{
  state: TaxState;
  dispatch: React.Dispatch<TaxAction>;
} | null>(null);

const taxReducer = (state: TaxState, action: TaxAction): TaxState => {
  switch (action.type) {
    case 'UPDATE_RATES':
      return { ...state, ...action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

interface TaxProviderProps {
  children: ReactNode;
}

export const TaxProvider: React.FC<TaxProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(taxReducer, initialState);

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

export default TaxProvider;
