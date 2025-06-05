
import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePOSIntegration } from '../context/POSIntegrationContext';
import { 
  CreditCardIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const POSIntegrationStatus: React.FC = () => {
  const { t } = useTranslation();
  const { isEnabled, integrations, connectIntegration, disconnectIntegration } = usePOSIntegration();

  if (!isEnabled) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-3">
          <CreditCardIcon className="w-6 h-6 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t('dashboard.posIntegration.disabled', 'POS Integration Disabled')}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {t('dashboard.posIntegration.enableHint', 'Enable in Setup to connect POS systems')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const connectedIntegrations = integrations.filter(i => i.status === 'connected');
  const hasConnections = connectedIntegrations.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {t('dashboard.posIntegration.title', 'POS & Accounting Integrations')}
        </h3>
        <div className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
          MOCK
        </div>
      </div>

      {hasConnections ? (
        <div className="space-y-3">
          {connectedIntegrations.map((integration) => (
            <div 
              key={integration.id}
              className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{integration.logo}</span>
                <div>
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    {integration.name}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-green-700 dark:text-green-300">
                    <span>Last sync: {new Date(integration.lastSync!).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{integration.transactionCount} transactions</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                <button
                  onClick={() => disconnectIntegration(integration.id)}
                  className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ))}
          
          <div className="text-center">
            <button
              onClick={() => {
                const randomIntegration = integrations.find(i => i.status === 'disconnected');
                if (randomIntegration) {
                  connectIntegration(randomIntegration.id);
                }
              }}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 flex items-center space-x-1 mx-auto"
            >
              <ArrowPathIcon className="w-4 h-4" />
              <span>Sync Now</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {integrations.map((integration) => (
            <div 
              key={integration.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl opacity-50">{integration.logo}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {integration.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {integration.type} • Not connected
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => connectIntegration(integration.id)}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default POSIntegrationStatus;
