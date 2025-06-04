import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ftaService } from '../services/ftaService';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface FTAIntegrationStatusProps {
  trn?: string;
  showDetails?: boolean;
  variant?: 'badge' | 'card' | 'full';
}

const FTAIntegrationStatus: React.FC<FTAIntegrationStatusProps> = ({
  trn,
  showDetails = false,
  variant = 'badge'
}) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'pending' | 'error'>('pending');
  const [lastSync, setLastSync] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      setIsLoading(true);
      try {
        const ftaStatus = await ftaService.getIntegrationStatus();
        setStatus(ftaStatus.status);
        setLastSync(ftaStatus.lastSync);
      } catch (error) {
        setStatus('error');
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [trn]);

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded-md w-32"></div>
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="ml-2">{t(`fta.status.${status}`)}</span>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getStatusIcon()}
            <h3 className="ml-2 text-lg font-medium text-gray-900 dark:text-white">
              {t('fta.integration')}
            </h3>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {t(`fta.status.${status}`)}
          </span>
        </div>
        {showDetails && lastSync && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t('fta.lastSync')}: {new Date(lastSync).toLocaleString()}
          </p>
        )}
      </div>
    );
  }

  return null;
};

export default FTAIntegrationStatus;