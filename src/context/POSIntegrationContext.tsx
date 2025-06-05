
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface POSIntegration {
  id: string;
  name: string;
  type: 'pos' | 'accounting';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  transactionCount?: number;
  logo?: string;
}

interface POSIntegrationContextType {
  isEnabled: boolean;
  integrations: POSIntegration[];
  togglePOSIntegration: () => void;
  connectIntegration: (id: string) => void;
  disconnectIntegration: (id: string) => void;
}

const POSIntegrationContext = createContext<POSIntegrationContextType | undefined>(undefined);

const mockIntegrations: POSIntegration[] = [
  {
    id: 'omnivore',
    name: 'Omnivore POS',
    type: 'pos',
    status: 'disconnected',
    logo: '🍽️'
  },
  {
    id: 'zoho',
    name: 'Zoho Books',
    type: 'accounting',
    status: 'disconnected',
    logo: '📚'
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    type: 'accounting',
    status: 'disconnected',
    logo: '💼'
  }
];

export const POSIntegrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(() => {
    return localStorage.getItem('pos_integration_enabled') === 'true';
  });
  
  const [integrations, setIntegrations] = useState<POSIntegration[]>(() => {
    const saved = localStorage.getItem('pos_integrations');
    return saved ? JSON.parse(saved) : mockIntegrations;
  });

  useEffect(() => {
    localStorage.setItem('pos_integration_enabled', isEnabled.toString());
    localStorage.setItem('pos_integrations', JSON.stringify(integrations));
  }, [isEnabled, integrations]);

  const togglePOSIntegration = () => {
    setIsEnabled(!isEnabled);
  };

  const connectIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { 
            ...integration, 
            status: 'connected' as const, 
            lastSync: new Date().toISOString(),
            transactionCount: Math.floor(Math.random() * 1000) + 50
          }
        : integration
    ));
  };

  const disconnectIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { ...integration, status: 'disconnected' as const, lastSync: undefined, transactionCount: undefined }
        : integration
    ));
  };

  return (
    <POSIntegrationContext.Provider value={{
      isEnabled,
      integrations,
      togglePOSIntegration,
      connectIntegration,
      disconnectIntegration
    }}>
      {children}
    </POSIntegrationContext.Provider>
  );
};

export const usePOSIntegration = () => {
  const context = useContext(POSIntegrationContext);
  if (context === undefined) {
    throw new Error('usePOSIntegration must be used within a POSIntegrationProvider');
  }
  return context;
};
