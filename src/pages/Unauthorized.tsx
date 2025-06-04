import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserRole } from '../context/UserRoleContext';
import { 
  ExclamationTriangleIcon, 
  HomeIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';
import { ROLE_LABELS } from '../types/roles';

const Unauthorized: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { role } = useUserRole();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 text-red-500 mb-6">
            <ExclamationTriangleIcon className="h-full w-full" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            403
          </h1>

          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            {t('unauthorized.title', 'Access Denied')}
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {t('unauthorized.message', "You don't have permission to access this page.")}
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
            Current role: <span className="font-medium text-indigo-600 dark:text-indigo-400">
              {ROLE_LABELS[role]}
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              {t('unauthorized.goBack', 'Go Back')}
            </button>

            <button
              onClick={handleGoHome}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <HomeIcon className="w-4 h-4 mr-2" />
              {t('unauthorized.goHome', 'Go to Dashboard')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;