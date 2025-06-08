import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_URL || '';
export const transferPricingService = {
    // Create a new transfer pricing disclosure
    createDisclosure: async (data) => {
        const response = await axios.post(`${API_BASE_URL}/api/transfer-pricing/disclosures`, data);
        return response.data;
    },
    // Get a specific disclosure by ID
    getDisclosure: async (id) => {
        const response = await axios.get(`${API_BASE_URL}/api/transfer-pricing/disclosures/${id}`);
        return response.data;
    },
    // Get all disclosures for the current user/company
    getAllDisclosures: async () => {
        const response = await axios.get(`${API_BASE_URL}/api/transfer-pricing/disclosures`);
        return response.data;
    },
    // Update an existing disclosure
    updateDisclosure: async (id, data) => {
        const response = await axios.put(`${API_BASE_URL}/api/transfer-pricing/disclosures/${id}`, data);
        return response.data;
    },
    // Submit a disclosure for review
    submitDisclosure: async (id) => {
        const response = await axios.post(`${API_BASE_URL}/api/transfer-pricing/disclosures/${id}/submit`);
        return response.data;
    },
    // Upload a file (masterFile, localFile, or cbcReport)
    uploadFile: async (disclosureId, fileType, file) => {
        const formData = new FormData();
        formData.append('file', file);
        await axios.post(`${API_BASE_URL}/api/transfer-pricing/disclosures/${disclosureId}/files/${fileType}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    // Add a new related party transaction to a disclosure
    addTransaction: async (disclosureId, transaction) => {
        const response = await axios.post(`${API_BASE_URL}/api/transfer-pricing/disclosures/${disclosureId}/transactions`, transaction);
        return response.data;
    },
    // Update an existing transaction
    updateTransaction: async (disclosureId, transactionId, data) => {
        const response = await axios.put(`${API_BASE_URL}/api/transfer-pricing/disclosures/${disclosureId}/transactions/${transactionId}`, data);
        return response.data;
    },
    // Delete a transaction
    deleteTransaction: async (disclosureId, transactionId) => {
        await axios.delete(`${API_BASE_URL}/api/transfer-pricing/disclosures/${disclosureId}/transactions/${transactionId}`);
    },
};
