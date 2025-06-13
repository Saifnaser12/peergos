import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const TaxAgentContext = createContext(undefined);
export const TaxAgentProvider = ({ children }) => {
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [isAgentRequired, setIsAgentRequired] = useState(false);
    // Mock available agents
    const availableAgents = [
        {
            id: '1',
            name: 'Ahmed Al-Rashid Tax Services',
            license: 'FTA-001-2024',
            email: 'ahmed@taxservices.ae',
            phone: '+971-4-123-4567',
            specialization: ['VAT', 'CIT', 'Transfer Pricing'],
            rating: 4.8,
            isActive: true
        },
        {
            id: '2',
            name: 'Emirates Business Consultancy',
            license: 'FTA-002-2024',
            email: 'info@emiratesbiz.ae',
            phone: '+971-4-234-5678',
            specialization: ['VAT', 'CIT', 'Free Zone'],
            rating: 4.6,
            isActive: true
        }
    ];
    const value = {
        selectedAgent,
        setSelectedAgent,
        availableAgents,
        isAgentRequired,
        setIsAgentRequired
    };
    return (_jsx(TaxAgentContext.Provider, { value: value, children: children }));
};
export const useTaxAgent = () => {
    const context = useContext(TaxAgentContext);
    if (context === undefined) {
        throw new Error('useTaxAgent must be used within a TaxAgentProvider');
    }
    return context;
};
