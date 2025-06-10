
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TransferPricingContextType {
  transferPricingData: any;
  setTransferPricingData: (data: any) => void;
  documentationStatus: 'pending' | 'in-progress' | 'completed';
  updateDocumentationStatus: (status: 'pending' | 'in-progress' | 'completed') => void;
}

const TransferPricingContext = createContext<TransferPricingContextType | undefined>(undefined);

export const useTransferPricing = () => {
  const context = useContext(TransferPricingContext);
  if (!context) {
    throw new Error('useTransferPricing must be used within a TransferPricingProvider');
  }
  return context;
};

interface TransferPricingProviderProps {
  children: ReactNode;
}

export const TransferPricingProvider: React.FC<TransferPricingProviderProps> = ({ children }) => {
  const [transferPricingData, setTransferPricingData] = useState(null);
  const [documentationStatus, setDocumentationStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');

  const updateDocumentationStatus = (status: 'pending' | 'in-progress' | 'completed') => {
    setDocumentationStatus(status);
  };

  const value = {
    transferPricingData,
    setTransferPricingData,
    documentationStatus,
    updateDocumentationStatus,
  };

  return (
    <TransferPricingContext.Provider value={value}>
      {children}
    </TransferPricingContext.Provider>
  );
};
