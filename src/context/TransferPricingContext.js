import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useReducer, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
// Initial state
const initialState = {
    relatedParties: [],
    transactions: [],
    documents: [],
    loading: false,
    error: null
};
// Reducer
const transferPricingReducer = (state, action) => {
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
                relatedParties: state.relatedParties.map(party => party.id === action.payload.id ? action.payload : party)
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
                transactions: state.transactions.map(transaction => transaction.id === action.payload.id ? action.payload : transaction)
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
                documents: state.documents.map(doc => doc.id === action.payload.id ? action.payload : doc)
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
const TransferPricingContext = createContext(undefined);
// Provider component
export const TransferPricingProvider = ({ children }) => {
    const [state, dispatch] = useReducer(transferPricingReducer, initialState);
    const addRelatedParty = useCallback((party) => {
        const newParty = {
            ...party,
            id: uuidv4()
        };
        dispatch({ type: 'ADD_RELATED_PARTY', payload: newParty });
    }, []);
    const updateRelatedParty = useCallback((party) => {
        dispatch({ type: 'UPDATE_RELATED_PARTY', payload: party });
    }, []);
    const deleteRelatedParty = useCallback((id) => {
        dispatch({ type: 'DELETE_RELATED_PARTY', payload: id });
    }, []);
    const addTransaction = useCallback((transaction) => {
        const newTransaction = {
            ...transaction,
            id: uuidv4(),
            lastModified: new Date().toISOString()
        };
        dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    }, []);
    const updateTransaction = useCallback((transaction) => {
        dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
    }, []);
    const deleteTransaction = useCallback((id) => {
        dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    }, []);
    const addDocument = useCallback((document) => {
        const newDocument = {
            ...document,
            id: uuidv4(),
            uploadDate: new Date().toISOString()
        };
        dispatch({ type: 'ADD_DOCUMENT', payload: newDocument });
    }, []);
    const updateDocument = useCallback((document) => {
        dispatch({ type: 'UPDATE_DOCUMENT', payload: document });
    }, []);
    const deleteDocument = useCallback((id) => {
        dispatch({ type: 'DELETE_DOCUMENT', payload: id });
    }, []);
    const validateTransaction = useCallback((transaction) => {
        const errors = [];
        if (!transaction.relatedPartyId) {
            errors.push('Related party is required');
        }
        else if (!state.relatedParties.find(party => party.id === transaction.relatedPartyId)) {
            errors.push('Invalid related party');
        }
        if (!transaction.transactionType) {
            errors.push('Transaction type is required');
        }
        else if (!Object.values(TransactionType).includes(transaction.transactionType)) {
            errors.push('Invalid transaction type');
        }
        if (!transaction.transferPricingMethod) {
            errors.push('Transfer pricing method is required');
        }
        else if (!Object.values(TransferPricingMethod).includes(transaction.transferPricingMethod)) {
            errors.push('Invalid transfer pricing method');
        }
        const transactionValue = transaction.transactionValue;
        if (typeof transactionValue !== 'number' || transactionValue <= 0) {
            errors.push('Transaction value must be greater than 0');
        }
        else {
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
        const hasRequiredDocuments = transaction.documents?.some(doc => doc.type === 'MASTER_FILE' || doc.type === 'LOCAL_FILE');
        if (!hasRequiredDocuments) {
            errors.push('Master File or Local File is required');
        }
        return errors;
    }, [state.relatedParties]);
    return (_jsx(TransferPricingContext.Provider, { value: {
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
        }, children: children }));
};
// Custom hook
export const useTransferPricing = () => {
    const context = useContext(TransferPricingContext);
    if (context === undefined) {
        throw new Error('useTransferPricing must be used within a TransferPricingProvider');
    }
    return context;
};
