import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useReducer, useCallback } from 'react';
import { InvoiceStatus } from '../types/invoice';
import { InvoiceService } from '../services/invoice.service';
const initialState = {
    invoices: [],
    currentInvoice: null,
    loading: false,
    error: null,
    total: 0,
    currentPage: 1
};
const invoiceReducer = (state, action) => {
    switch (action.type) {
        case 'SET_INVOICES':
            return {
                ...state,
                invoices: action.payload.invoices,
                total: action.payload.total
            };
        case 'SET_CURRENT_INVOICE':
            return {
                ...state,
                currentInvoice: action.payload
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            };
        case 'SET_PAGE':
            return {
                ...state,
                currentPage: action.payload
            };
        case 'UPDATE_INVOICE_STATUS':
            return {
                ...state,
                invoices: state.invoices.map(invoice => invoice.id === action.payload.id
                    ? { ...invoice, status: action.payload.status }
                    : invoice),
                currentInvoice: state.currentInvoice?.id === action.payload.id
                    ? { ...state.currentInvoice, status: action.payload.status }
                    : state.currentInvoice
            };
        default:
            return state;
    }
};
const InvoiceContext = createContext(undefined);
export const useInvoice = () => {
    const context = useContext(InvoiceContext);
    if (!context) {
        throw new Error('useInvoice must be used within an InvoiceProvider');
    }
    return context;
};
export const InvoiceProvider = ({ children }) => {
    const [state, dispatch] = useReducer(invoiceReducer, initialState);
    const invoiceService = InvoiceService.getInstance();
    const loadInvoices = useCallback(async (page = state.currentPage, filters) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const result = await invoiceService.listInvoices(page, 10, filters);
            dispatch({ type: 'SET_INVOICES', payload: result });
            dispatch({ type: 'SET_PAGE', payload: page });
        }
        catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load invoices' });
        }
        finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [state.currentPage]);
    const getInvoice = useCallback(async (id) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const result = await invoiceService.getInvoice(id);
            if (result) {
                dispatch({ type: 'SET_CURRENT_INVOICE', payload: result.invoice });
            }
            else {
                dispatch({ type: 'SET_ERROR', payload: 'Invoice not found' });
            }
        }
        catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load invoice' });
        }
        finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);
    const generateInvoice = useCallback(async (invoice) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await invoiceService.generateInvoice(invoice);
            dispatch({ type: 'SET_CURRENT_INVOICE', payload: invoice });
            await loadInvoices();
        }
        catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to generate invoice' });
        }
        finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [loadInvoices]);
    const submitInvoice = useCallback(async (invoice) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const result = await invoiceService.submitInvoice(invoice);
            dispatch({
                type: 'UPDATE_INVOICE_STATUS',
                payload: { id: invoice.id, status: InvoiceStatus.SUBMITTED }
            });
            await loadInvoices();
        }
        catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to submit invoice' });
        }
        finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [loadInvoices]);
    const deleteInvoice = useCallback(async (id) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await invoiceService.deleteInvoice(id);
            await loadInvoices();
        }
        catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to delete invoice' });
        }
        finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [loadInvoices]);
    const setPage = useCallback((page) => {
        dispatch({ type: 'SET_PAGE', payload: page });
    }, []);
    const value = {
        ...state,
        loadInvoices,
        getInvoice,
        generateInvoice,
        submitInvoice,
        deleteInvoice,
        setPage
    };
    return (_jsx(InvoiceContext.Provider, { value: value, children: children }));
};
