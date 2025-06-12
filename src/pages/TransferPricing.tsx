import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TransferPricingForm } from '../components/transferPricing/TransferPricingForm';

export const TransferPricing: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {t('transferPricing.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {t('transferPricing.description')}
        </Typography>
      </Paper>

      <TransferPricingForm />

      {/* Master File / Local File Upload */}
      <Paper elevation={0} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6">
        <Box className="flex items-start gap-6">
          <Box className="flex-1">
            <Typography variant="h6" className="text-gray-900 dark:text-white font-semibold mb-4">
              {t('transferPricing.documentation.title', 'Master File / Local File / CbC Upload')}
            </Typography>
          </Box>
          <div className="hidden md:block">
            <img 
              src="/images/peergos_slide_13.png" 
              alt="Transfer Pricing Documentation"
              className="w-32 h-24 object-cover rounded-lg opacity-60"
            />
          </div>
        </Box>
      </Paper>

      {/* Automated Related Party Tracking */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  🔄 Automated Related Party Tracking
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Automatic detection and compliance monitoring for transfer pricing
                </p>
              </div>
              <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200 rounded-full">
                AI-Powered
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Transaction Monitoring</h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Automatically identifies related party transactions and flags for transfer pricing review
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Compliance Alerts</h4>
                <p className="text-sm text-purple-600 dark:text-purple-300">
                  Real-time notifications for transfer pricing documentation requirements
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Party Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8"></div>
    </Container>
  );
};

export default TransferPricing;