import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  TransferPricingState,
  RelatedParty,
  TransferPricingTransaction,
  TransferPricingDocument,
  TransactionType,
  TransferPricingMethod
} from '../types/transferPricing';

// Initial state
const initialState: TransferPricingState = {
  relatedParties: [],
  transactions: [],
  documents: [],
  loading: false,
  error: null
};

// Action types
type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_RELATED_PARTY'; payload: RelatedParty }
  | { type: 'UPDATE_RELATED_PARTY'; payload: RelatedParty }
  | { type: 'DELETE_RELATED_PARTY'; payload: string }
  | { type: 'ADD_TRANSACTION'; payload: TransferPricingTransaction }
  | { type: 'UPDATE_TRANSACTION'; payload: TransferPricingTransaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_DOCUMENT'; payload: TransferPricingDocument }
  | { type: 'UPDATE_DOCUMENT'; payload: TransferPricingDocument }
  | { type: 'DELETE_DOCUMENT'; payload: string };

// Reducer
const transferPricingReducer = (state: TransferPricingState, action: Action): TransferPricingState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_RELATED_PARTY':
      return { ...state, relatedParties: [...state.relatedParties, action.payload] };
    case 'UPDATE_RELATED_PARTY':
      return {
        ...state,
        relatedParties: state.relatedParties.map(party =>
          party.id === action.payload.id ? action.payload : party
        )
      };
    case 'DELETE_RELATED_PARTY':
      return {
        ...state,
        relatedParties: state.relatedParties.filter(party => party.id !== action.payload)
      };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(transaction =>
          transaction.id === action.payload.id ? action.payload : transaction
        )
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction.id !== action.payload)
      };
    case 'ADD_DOCUMENT':
      return { ...state, documents: [...state.documents, action.payload] };
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map(doc =>
          doc.id === action.payload.id ? action.payload : doc
        )
      };
    case 'DELETE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(doc => doc.id !== action.payload)
      };
    default:
      return state;
  }
};

// Context
interface TransferPricingContextType extends TransferPricingState {
  addRelatedParty: (party: Omit<RelatedParty, 'id'>) => void;
  updateRelatedParty: (party: RelatedParty) => void;
  deleteRelatedParty: (id: string) => void;
  addTransaction: (transaction: Omit<TransferPricingTransaction, 'id' | 'lastModified'>) => void;
  updateTransaction: (transaction: TransferPricingTransaction) => void;
  deleteTransaction: (id: string) => void;
  addDocument: (document: Omit<TransferPricingDocument, 'id' | 'uploadDate'>) => void;
  updateDocument: (document: TransferPricingDocument) => void;
  deleteDocument: (id: string) => void;
  validateTransaction: (transaction: Partial<TransferPricingTransaction>) => string[];
}

const TransferPricingContext = createContext<TransferPricingContextType | undefined>(undefined);

// Provider component
export const TransferPricingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(transferPricingReducer, initialState);

  const addRelatedParty = useCallback((party: Omit<RelatedParty, 'id'>) => {
    const newParty: RelatedParty = {
      ...party,
      id: uuidv4()
    };
    dispatch({ type: 'ADD_RELATED_PARTY', payload: newParty });
  }, []);

  const updateRelatedParty = useCallback((party: RelatedParty) => {
    dispatch({ type: 'UPDATE_RELATED_PARTY', payload: party });
  }, []);

  const deleteRelatedParty = useCallback((id: string) => {
    dispatch({ type: 'DELETE_RELATED_PARTY', payload: id });
  }, []);

  const addTransaction = useCallback(
    (transaction: Omit<TransferPricingTransaction, 'id' | 'lastModified'>) => {
      const newTransaction: TransferPricingTransaction = {
        ...transaction,
        id: uuidv4(),
        lastModified: new Date().toISOString()
      };
      dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    },
    []
  );

  const updateTransaction = useCallback((transaction: TransferPricingTransaction) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  }, []);

  const addDocument = useCallback(
    (document: Omit<TransferPricingDocument, 'id' | 'uploadDate'>) => {
      const newDocument: TransferPricingDocument = {
        ...document,
        id: uuidv4(),
        uploadDate: new Date().toISOString()
      };
      dispatch({ type: 'ADD_DOCUMENT', payload: newDocument });
    },
    []
  );

  const updateDocument = useCallback((document: TransferPricingDocument) => {
    dispatch({ type: 'UPDATE_DOCUMENT', payload: document });
  }, []);

  const deleteDocument = useCallback((id: string) => {
    dispatch({ type: 'DELETE_DOCUMENT', payload: id });
  }, []);

  const validateTransaction = useCallback(
    (transaction: Partial<TransferPricingTransaction>): string[] => {
      const errors: string[] = [];

      if (!transaction.relatedPartyId) {
        errors.push('Related party is required');
      } else if (!state.relatedParties.find(party => party.id === transaction.relatedPartyId)) {
        errors.push('Invalid related party');
      }

      if (!transaction.transactionType) {
        errors.push('Transaction type is required');
      } else if (!Object.values(TransactionType).includes(transaction.transactionType)) {
        errors.push('Invalid transaction type');
      }

      if (!transaction.transferPricingMethod) {
        errors.push('Transfer pricing method is required');
      } else if (!Object.values(TransferPricingMethod).includes(transaction.transferPricingMethod)) {
        errors.push('Invalid transfer pricing method');
      }

      const transactionValue = transaction.transactionValue;
      if (typeof transactionValue !== 'number' || transactionValue <= 0) {
        errors.push('Transaction value must be greater than 0');
      } else {
        // Check for CbC Report requirement (example threshold)
        const cbcThreshold = 3200000000; // AED 3.2 billion
        if (transactionValue > cbcThreshold) {
          const hasCbcReport = transaction.documents?.some(doc => doc.type === 'CBC_REPORT');
          if (!hasCbcReport) {
            errors.push('CbC Report is required for transactions over AED 3.2 billion');
          }
        }
      }

      if (!transaction.fiscalYear) {
        errors.push('Fiscal year is required');
      }

      if (!transaction.description) {
        errors.push('Description is required');
      }

      // Check for required documents based on transaction value
      const hasRequiredDocuments = transaction.documents?.some(
        doc => doc.type === 'MASTER_FILE' || doc.type === 'LOCAL_FILE'
      );

      if (!hasRequiredDocuments) {
        errors.push('Master File or Local File is required');
      }

      return errors;
    },
    [state.relatedParties]
  );

  return (
    <TransferPricingContext.Provider
      value={{
        ...state,
        addRelatedParty,
        updateRelatedParty,
        deleteRelatedParty,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addDocument,
        updateDocument,
        deleteDocument,
        validateTransaction
      }}
    >
      {children}
    </TransferPricingContext.Provider>
  );
};

// Custom hook
export const useTransferPricing = () => {
  const context = useContext(TransferPricingContext);
  if (context === undefined) {
    throw new Error('useTransferPricing must be used within a TransferPricingProvider');
  }
  return context;
}; 