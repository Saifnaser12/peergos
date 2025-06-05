
import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePOSIntegration } from '../context/POSIntegrationContext';
import { 
  CreditCardIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

interface POSIntegrationToggleProps {
  variant?: 'setup' | 'settings';
}

const POSIntegrationToggle: React.FC<POSIntegrationToggleProps> = ({ variant = 'setup' }) => {
  const { t } = useTranslation();
  const { isEnabled, integrations, togglePOSIntegration } = usePOSIntegration();

  const connectedIntegrations = integrations.filter(i => i.status === 'connected');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
            <CreditCardIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('setup.posIntegration.title', 'POS & Accounting Integration')}
            </h3>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={togglePOSIntegration}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('setup.posIntegration.description', 'Connect your POS system and accounting software for automatic transaction sync and invoice processing.')}
          </p>

          {/* Mock Integration Status */}
          <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                {t('setup.posIntegration.mockWarning', 'Mock Integration - Demo Only')}
              </span>
            </div>
            <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
              {t('setup.posIntegration.mockDescription', 'This is a demonstration of POS integration features. No actual connections are made.')}
            </p>
          </div>

          {isEnabled && (
            <div className="mt-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                {t('setup.posIntegration.availableIntegrations', 'Available Integrations')}
              </h4>
              
              <div className="grid grid-cols-1 gap-2">
                {integrations.map((integration) => (
                  <div 
                    key={integration.id}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{integration.logo}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {integration.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {integration.type} • {integration.status}
                        </p>
                      </div>
                    </div>
                    
                    {integration.status === 'connected' && (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
              
              {connectedIntegrations.length > 0 && (
                <div className="mt-3 text-sm text-green-700 dark:text-green-400">
                  ✓ {connectedIntegrations.length} integration(s) configured
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default POSIntegrationToggle;
