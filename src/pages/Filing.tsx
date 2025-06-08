
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Paper } from '@mui/material';

const Filing: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('nav.filing')}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Tax filing functionality coming soon.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Filing;
import React from 'react';
import { useTranslation } from 'react-i18next';

const Filing: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            {t('filing.title', 'Tax Filing')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('filing.subtitle', 'Manage your tax filings and submissions')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Filing;
