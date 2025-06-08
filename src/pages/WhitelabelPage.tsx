
import React from 'react';
import { useTranslation } from 'react-i18next';
import WhitelabelConfig from '../components/WhitelabelConfig';
import {
  SwatchIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const WhitelabelPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            {t('common.backToAdmin', 'Back to Admin')}
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <SwatchIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('whitelabel.page.title', 'Whitelabel Configuration')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t('whitelabel.page.subtitle', 'Customize branding and appearance for your organization')}
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Component */}
        <WhitelabelConfig />
      </div>
    </div>
  );
};

export default WhitelabelPage;
