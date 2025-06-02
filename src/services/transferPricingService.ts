import axios from 'axios';
import { RelatedPartyTransaction, TransferPricingDisclosure } from '../types/transferPricing';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

interface CreateDisclosureRequest {
  taxYear: number;
  transactions: Omit<RelatedPartyTransaction, 'id' | 'createdAt' | 'updatedAt'>[];
}

export const transferPricingService = {
  // Create a new transfer pricing disclosure
  createDisclosure: async (data: CreateDisclosureRequest): Promise<TransferPricingDisclosure> => {
    const response = await axios.post<TransferPricingDisclosure>(`${API_BASE_URL}/api/transfer-pricing/disclosures`, data);
    return response.data;
  },

  // Get a specific disclosure by ID
  getDisclosure: async (id: string): Promise<TransferPricingDisclosure> => {
    const response = await axios.get<TransferPricingDisclosure>(`${API_BASE_URL}/api/transfer-pricing/disclosures/${id}`);
    return response.data;
  },

  // Get all disclosures for the current user/company
  getAllDisclosures: async (): Promise<TransferPricingDisclosure[]> => {
    const response = await axios.get<TransferPricingDisclosure[]>(`${API_BASE_URL}/api/transfer-pricing/disclosures`);
    return response.data;
  },

  // Update an existing disclosure
  updateDisclosure: async (id: string, data: Partial<TransferPricingDisclosure>): Promise<TransferPricingDisclosure> => {
    const response = await axios.put<TransferPricingDisclosure>(`${API_BASE_URL}/api/transfer-pricing/disclosures/${id}`, data);
    return response.data;
  },

  // Submit a disclosure for review
  submitDisclosure: async (id: string): Promise<TransferPricingDisclosure> => {
    const response = await axios.post<TransferPricingDisclosure>(`${API_BASE_URL}/api/transfer-pricing/disclosures/${id}/submit`);
    return response.data;
  },

  // Upload a file (masterFile, localFile, or cbcReport)
  uploadFile: async (disclosureId: string, fileType: 'masterFile' | 'localFile' | 'cbcReport', file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    
    await axios.post(
      `${API_BASE_URL}/api/transfer-pricing/disclosures/${disclosureId}/files/${fileType}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  // Add a new related party transaction to a disclosure
  addTransaction: async (disclosureId: string, transaction: Omit<RelatedPartyTransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<RelatedPartyTransaction> => {
    const response = await axios.post<RelatedPartyTransaction>(
      `${API_BASE_URL}/api/transfer-pricing/disclosures/${disclosureId}/transactions`,
      transaction
    );
    return response.data;
  },

  // Update an existing transaction
  updateTransaction: async (disclosureId: string, transactionId: string, data: Partial<RelatedPartyTransaction>): Promise<RelatedPartyTransaction> => {
    const response = await axios.put<RelatedPartyTransaction>(
      `${API_BASE_URL}/api/transfer-pricing/disclosures/${disclosureId}/transactions/${transactionId}`,
      data
    );
    return response.data;
  },

  // Delete a transaction
  deleteTransaction: async (disclosureId: string, transactionId: string): Promise<void> => {
    await axios.delete(
      `${API_BASE_URL}/api/transfer-pricing/disclosures/${disclosureId}/transactions/${transactionId}`
    );
  },
}; 