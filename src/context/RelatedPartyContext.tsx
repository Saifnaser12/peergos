import React, { createContext, useContext, useState } from 'react';
import type { RelatedParty } from '../components/RelatedPartyTable';

interface RelatedPartyContextType {
  showRelatedParty: boolean;
  toggleRelatedParty: () => void;
  transactions: RelatedParty[];
  addTransaction: (transaction: Omit<RelatedParty, 'id'>) => void;
  removeTransaction: (id: string) => void;
}

const RelatedPartyContext = createContext<RelatedPartyContextType | undefined>(undefined);

export const useRelatedParty = () => {
  const context = useContext(RelatedPartyContext);
  if (context === undefined) {
    throw new Error('useRelatedParty must be used within a RelatedPartyProvider');
  }
  return context;
};

// Sample data
const sampleTransactions: RelatedParty[] = [
  {
    id: '1',
    partyName: 'Global Tech Holdings',
    relationship: 'Parent',
    country: 'United Arab Emirates',
    transactionType: 'Services',
    value: 5000000
  },
  {
    id: '2',
    partyName: 'Innovation Systems LLC',
    relationship: 'Subsidiary',
    country: 'Saudi Arabia',
    transactionType: 'IP',
    value: 2500000
  },
  {
    id: '3',
    partyName: 'Finance Solutions Co.',
    relationship: 'Associate',
    country: 'Kuwait',
    transactionType: 'Financing',
    value: 10000000
  }
];

export const RelatedPartyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showRelatedParty, setShowRelatedParty] = useState(false);
  const [transactions, setTransactions] = useState<RelatedParty[]>(sampleTransactions);

  const toggleRelatedParty = () => {
    setShowRelatedParty(prev => !prev);
  };

  const addTransaction = (transaction: Omit<RelatedParty, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9)
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const removeTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <RelatedPartyContext.Provider
      value={{
        showRelatedParty,
        toggleRelatedParty,
        transactions,
        addTransaction,
        removeTransaction
      }}
    >
      {children}
    </RelatedPartyContext.Provider>
  );
}; 