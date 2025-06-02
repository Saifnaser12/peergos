import { useState, useCallback } from 'react';
import { RelatedPartyTransaction, TransferPricingDisclosure } from '../types/transferPricing';
import { transferPricingService } from '../services/transferPricingService';

interface UseTransferPricingReturn {
  loading: boolean;
  error: Error | null;
  disclosures: TransferPricingDisclosure[];
  currentDisclosure: TransferPricingDisclosure | null;
  createDisclosure: (data: { taxYear: number; transactions: Omit<RelatedPartyTransaction, 'id' | 'createdAt' | 'updatedAt'>[]; }) => Promise<TransferPricingDisclosure>;
  getDisclosure: (id: string) => Promise<void>;
  getAllDisclosures: () => Promise<void>;
  updateDisclosure: (id: string, data: Partial<TransferPricingDisclosure>) => Promise<void>;
  submitDisclosure: (id: string) => Promise<void>;
  uploadFile: (disclosureId: string, fileType: 'masterFile' | 'localFile' | 'cbcReport', file: File) => Promise<void>;
  addTransaction: (disclosureId: string, transaction: Omit<RelatedPartyTransaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (disclosureId: string, transactionId: string, data: Partial<RelatedPartyTransaction>) => Promise<void>;
  deleteTransaction: (disclosureId: string, transactionId: string) => Promise<void>;
}

export const useTransferPricing = (): UseTransferPricingReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [disclosures, setDisclosures] = useState<TransferPricingDisclosure[]>([]);
  const [currentDisclosure, setCurrentDisclosure] = useState<TransferPricingDisclosure | null>(null);

  const handleError = (error: any) => {
    console.error('Transfer Pricing Error:', error);
    setError(error instanceof Error ? error : new Error(error?.message || 'An unknown error occurred'));
    setLoading(false);
  };

  const createDisclosure = useCallback(async (data: { taxYear: number; transactions: Omit<RelatedPartyTransaction, 'id' | 'createdAt' | 'updatedAt'>[]; }): Promise<TransferPricingDisclosure> => {
    try {
      setLoading(true);
      const newDisclosure = await transferPricingService.createDisclosure(data);
      setDisclosures(prev => [...prev, newDisclosure]);
      setCurrentDisclosure(newDisclosure);
      setLoading(false);
      return newDisclosure;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, []);

  const getDisclosure = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const disclosure = await transferPricingService.getDisclosure(id);
      setCurrentDisclosure(disclosure);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  }, []);

  const getAllDisclosures = useCallback(async () => {
    try {
      setLoading(true);
      const allDisclosures = await transferPricingService.getAllDisclosures();
      setDisclosures(allDisclosures);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  }, []);

  const updateDisclosure = useCallback(async (id: string, data: Partial<TransferPricingDisclosure>) => {
    try {
      setLoading(true);
      const updatedDisclosure = await transferPricingService.updateDisclosure(id, data);
      setDisclosures(prev => prev.map(d => d.id === id ? updatedDisclosure : d));
      setCurrentDisclosure(updatedDisclosure);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  }, []);

  const submitDisclosure = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const submittedDisclosure = await transferPricingService.submitDisclosure(id);
      setDisclosures(prev => prev.map(d => d.id === id ? submittedDisclosure : d));
      setCurrentDisclosure(submittedDisclosure);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  }, []);

  const uploadFile = useCallback(async (disclosureId: string, fileType: 'masterFile' | 'localFile' | 'cbcReport', file: File) => {
    try {
      setLoading(true);
      await transferPricingService.uploadFile(disclosureId, fileType, file);
      // Refresh the current disclosure to get updated file information
      await getDisclosure(disclosureId);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  }, [getDisclosure]);

  const addTransaction = useCallback(async (disclosureId: string, transaction: Omit<RelatedPartyTransaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const newTransaction = await transferPricingService.addTransaction(disclosureId, transaction);
      if (currentDisclosure && currentDisclosure.id === disclosureId) {
        setCurrentDisclosure({
          ...currentDisclosure,
          transactions: [...currentDisclosure.transactions, newTransaction],
        });
      }
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  }, [currentDisclosure]);

  const updateTransaction = useCallback(async (disclosureId: string, transactionId: string, data: Partial<RelatedPartyTransaction>) => {
    try {
      setLoading(true);
      const updatedTransaction = await transferPricingService.updateTransaction(disclosureId, transactionId, data);
      if (currentDisclosure && currentDisclosure.id === disclosureId) {
        setCurrentDisclosure({
          ...currentDisclosure,
          transactions: currentDisclosure.transactions.map(t => 
            t.id === transactionId ? updatedTransaction : t
          ),
        });
      }
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  }, [currentDisclosure]);

  const deleteTransaction = useCallback(async (disclosureId: string, transactionId: string) => {
    try {
      setLoading(true);
      await transferPricingService.deleteTransaction(disclosureId, transactionId);
      if (currentDisclosure && currentDisclosure.id === disclosureId) {
        setCurrentDisclosure({
          ...currentDisclosure,
          transactions: currentDisclosure.transactions.filter(t => t.id !== transactionId),
        });
      }
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  }, [currentDisclosure]);

  return {
    loading,
    error,
    disclosures,
    currentDisclosure,
    createDisclosure,
    getDisclosure,
    getAllDisclosures,
    updateDisclosure,
    submitDisclosure,
    uploadFile,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}; 