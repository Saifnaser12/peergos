import { useState, useCallback } from 'react';
import { transferPricingService } from '../services/transferPricingService';
export const useTransferPricing = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [disclosures, setDisclosures] = useState([]);
    const [currentDisclosure, setCurrentDisclosure] = useState(null);
    const handleError = (error) => {
        console.error('Transfer Pricing Error:', error);
        setError(error instanceof Error ? error : new Error(error?.message || 'An unknown error occurred'));
        setLoading(false);
    };
    const createDisclosure = useCallback(async (data) => {
        try {
            setLoading(true);
            const newDisclosure = await transferPricingService.createDisclosure(data);
            setDisclosures(prev => [...prev, newDisclosure]);
            setCurrentDisclosure(newDisclosure);
            setLoading(false);
            return newDisclosure;
        }
        catch (error) {
            handleError(error);
            throw error;
        }
    }, []);
    const getDisclosure = useCallback(async (id) => {
        try {
            setLoading(true);
            const disclosure = await transferPricingService.getDisclosure(id);
            setCurrentDisclosure(disclosure);
            setLoading(false);
        }
        catch (error) {
            handleError(error);
        }
    }, []);
    const getAllDisclosures = useCallback(async () => {
        try {
            setLoading(true);
            const allDisclosures = await transferPricingService.getAllDisclosures();
            setDisclosures(allDisclosures);
            setLoading(false);
        }
        catch (error) {
            handleError(error);
        }
    }, []);
    const updateDisclosure = useCallback(async (id, data) => {
        try {
            setLoading(true);
            const updatedDisclosure = await transferPricingService.updateDisclosure(id, data);
            setDisclosures(prev => prev.map(d => d.id === id ? updatedDisclosure : d));
            setCurrentDisclosure(updatedDisclosure);
            setLoading(false);
        }
        catch (error) {
            handleError(error);
        }
    }, []);
    const submitDisclosure = useCallback(async (id) => {
        try {
            setLoading(true);
            const submittedDisclosure = await transferPricingService.submitDisclosure(id);
            setDisclosures(prev => prev.map(d => d.id === id ? submittedDisclosure : d));
            setCurrentDisclosure(submittedDisclosure);
            setLoading(false);
        }
        catch (error) {
            handleError(error);
        }
    }, []);
    const uploadFile = useCallback(async (disclosureId, fileType, file) => {
        try {
            setLoading(true);
            await transferPricingService.uploadFile(disclosureId, fileType, file);
            // Refresh the current disclosure to get updated file information
            await getDisclosure(disclosureId);
            setLoading(false);
        }
        catch (error) {
            handleError(error);
        }
    }, [getDisclosure]);
    const addTransaction = useCallback(async (disclosureId, transaction) => {
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
        }
        catch (error) {
            handleError(error);
        }
    }, [currentDisclosure]);
    const updateTransaction = useCallback(async (disclosureId, transactionId, data) => {
        try {
            setLoading(true);
            const updatedTransaction = await transferPricingService.updateTransaction(disclosureId, transactionId, data);
            if (currentDisclosure && currentDisclosure.id === disclosureId) {
                setCurrentDisclosure({
                    ...currentDisclosure,
                    transactions: currentDisclosure.transactions.map(t => t.id === transactionId ? updatedTransaction : t),
                });
            }
            setLoading(false);
        }
        catch (error) {
            handleError(error);
        }
    }, [currentDisclosure]);
    const deleteTransaction = useCallback(async (disclosureId, transactionId) => {
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
        }
        catch (error) {
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
