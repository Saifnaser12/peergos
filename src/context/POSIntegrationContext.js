import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
const POSIntegrationContext = createContext(undefined);
const mockIntegrations = [
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
export const POSIntegrationProvider = ({ children }) => {
    const [isEnabled, setIsEnabled] = useState(() => {
        return localStorage.getItem('pos_integration_enabled') === 'true';
    });
    const [integrations, setIntegrations] = useState(() => {
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
    const connectIntegration = (id) => {
        setIntegrations(prev => prev.map(integration => integration.id === id
            ? {
                ...integration,
                status: 'connected',
                lastSync: new Date().toISOString(),
                transactionCount: Math.floor(Math.random() * 1000) + 50
            }
            : integration));
    };
    const disconnectIntegration = (id) => {
        setIntegrations(prev => prev.map(integration => integration.id === id
            ? { ...integration, status: 'disconnected', lastSync: undefined, transactionCount: undefined }
            : integration));
    };
    return (_jsx(POSIntegrationContext.Provider, { value: {
            isEnabled,
            integrations,
            togglePOSIntegration,
            connectIntegration,
            disconnectIntegration
        }, children: children }));
};
export const usePOSIntegration = () => {
    const context = useContext(POSIntegrationContext);
    if (context === undefined) {
        throw new Error('usePOSIntegration must be used within a POSIntegrationProvider');
    }
    return context;
};
