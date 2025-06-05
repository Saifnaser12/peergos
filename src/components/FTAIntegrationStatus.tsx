import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ftaService } from '../services/ftaService';

interface FTAIntegrationStatusProps {
  trn?: string;
  showDetails?: boolean;
  variant?: 'badge' | 'card';
}

const FTAIntegrationStatus: React.FC<FTAIntegrationStatusProps> = ({
  trn,
  showDetails = false,
  variant = 'badge'
}) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const isConnected = await ftaService.checkConnection();
        setStatus(isConnected ? 'connected' : 'disconnected');
        setLastSync(new Date().toISOString());
      } catch (error) {
        setStatus('error');
      }
    };

    checkStatus();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return t('fta.status.connected');
      case 'error': return t('fta.status.error');
      default: return t('fta.status.disconnected');
    }
  };

  if (variant === 'badge') {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'connected' ? 'bg-green-600' : status === 'error' ? 'bg-red-600' : 'bg-yellow-600'}`} />
        {getStatusText()}
      </span>
    );
  }

  if (variant === 'card') {
    return (
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            {t('fta.integration.title')}
          </h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'connected' ? 'bg-green-600' : status === 'error' ? 'bg-red-600' : 'bg-yellow-600'}`} />
            {getStatusText()}
          </span>
        </div>
        {showDetails && lastSync && (
          <p className="text-sm text-gray-500 mt-2">
            {t('fta.lastSync')}: {new Date(lastSync).toLocaleString()}
          </p>
        )}
      </div>
    );
  }

  return null;
};

export default FTAIntegrationStatus;