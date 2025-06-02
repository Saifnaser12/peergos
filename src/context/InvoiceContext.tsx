import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Invoice, InvoiceStatus } from '../types/invoice';
import { InvoiceService } from '../services/invoice.service';

interface InvoiceState {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
}

type InvoiceAction =
  | { type: 'SET_INVOICES'; payload: { invoices: Invoice[]; total: number } }
  | { type: 'SET_CURRENT_INVOICE'; payload: Invoice }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'UPDATE_INVOICE_STATUS'; payload: { id: string; status: InvoiceStatus } };

const initialState: InvoiceState = {
  invoices: [],
  currentInvoice: null,
  loading: false,
  error: null,
  total: 0,
  currentPage: 1
};

const invoiceReducer = (state: InvoiceState, action: InvoiceAction): InvoiceState => {
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
        invoices: state.invoices.map(invoice =>
          invoice.id === action.payload.id
            ? { ...invoice, status: action.payload.status }
            : invoice
        ),
        currentInvoice:
          state.currentInvoice?.id === action.payload.id
            ? { ...state.currentInvoice, status: action.payload.status }
            : state.currentInvoice
      };
    default:
      return state;
  }
};

interface InvoiceContextType extends InvoiceState {
  loadInvoices: (page?: number, filters?: { status?: string; dateRange?: { start: string; end: string } }) => Promise<void>;
  getInvoice: (id: string) => Promise<void>;
  generateInvoice: (invoice: Invoice) => Promise<void>;
  submitInvoice: (invoice: Invoice) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  setPage: (page: number) => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};

interface InvoiceProviderProps {
  children: React.ReactNode;
}

export const InvoiceProvider: React.FC<InvoiceProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(invoiceReducer, initialState);
  const invoiceService = InvoiceService.getInstance();

  const loadInvoices = useCallback(async (
    page: number = state.currentPage,
    filters?: { status?: string; dateRange?: { start: string; end: string } }
  ) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await invoiceService.listInvoices(page, 10, filters);
      dispatch({ type: 'SET_INVOICES', payload: result });
      dispatch({ type: 'SET_PAGE', payload: page });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load invoices' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.currentPage]);

  const getInvoice = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await invoiceService.getInvoice(id);
      if (result) {
        dispatch({ type: 'SET_CURRENT_INVOICE', payload: result.invoice });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Invoice not found' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load invoice' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const generateInvoice = useCallback(async (invoice: Invoice) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await invoiceService.generateInvoice(invoice);
      dispatch({ type: 'SET_CURRENT_INVOICE', payload: invoice });
      await loadInvoices();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to generate invoice' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [loadInvoices]);

  const submitInvoice = useCallback(async (invoice: Invoice) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await invoiceService.submitInvoice(invoice);
      dispatch({
        type: 'UPDATE_INVOICE_STATUS',
        payload: { id: invoice.id, status: InvoiceStatus.SUBMITTED }
      });
      await loadInvoices();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to submit invoice' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [loadInvoices]);

  const deleteInvoice = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await invoiceService.deleteInvoice(id);
      await loadInvoices();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete invoice' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [loadInvoices]);

  const setPage = useCallback((page: number) => {
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

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
}; 