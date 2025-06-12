import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TaxAgent {
  id: string;
  name: string;
  license: string;
  email: string;
  phone: string;
  specialization: string[];
  rating: number;
  isActive: boolean;
}

interface TaxAgentContextType {
  selectedAgent: TaxAgent | null;
  setSelectedAgent: (agent: TaxAgent | null) => void;
  availableAgents: TaxAgent[];
  isAgentRequired: boolean;
  setIsAgentRequired: (required: boolean) => void;
}

const TaxAgentContext = createContext<TaxAgentContextType | undefined>(undefined);

export const TaxAgentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedAgent, setSelectedAgent] = useState<TaxAgent | null>(null);
  const [isAgentRequired, setIsAgentRequired] = useState(false);

  // Mock available agents
  const availableAgents: TaxAgent[] = [
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

  return (
    <TaxAgentContext.Provider value={value}>
      {children}
    </TaxAgentContext.Provider>
  );
};

export const useTaxAgent = () => {
  const context = useContext(TaxAgentContext);
  if (context === undefined) {
    throw new Error('useTaxAgent must be used within a TaxAgentProvider');
  }
  return context;
};