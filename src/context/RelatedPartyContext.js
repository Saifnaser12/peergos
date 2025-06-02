import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const RelatedPartyContext = createContext(undefined);
export const useRelatedParty = () => {
    const context = useContext(RelatedPartyContext);
    if (context === undefined) {
        throw new Error('useRelatedParty must be used within a RelatedPartyProvider');
    }
    return context;
};
// Sample data
const sampleTransactions = [
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
export const RelatedPartyProvider = ({ children }) => {
    const [showRelatedParty, setShowRelatedParty] = useState(false);
    const [transactions, setTransactions] = useState(sampleTransactions);
    const toggleRelatedParty = () => {
        setShowRelatedParty(prev => !prev);
    };
    const addTransaction = (transaction) => {
        const newTransaction = {
            ...transaction,
            id: Math.random().toString(36).substr(2, 9)
        };
        setTransactions(prev => [...prev, newTransaction]);
    };
    const removeTransaction = (id) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };
    return (_jsx(RelatedPartyContext.Provider, { value: {
            showRelatedParty,
            toggleRelatedParty,
            transactions,
            addTransaction,
            removeTransaction
        }, children: children }));
};
