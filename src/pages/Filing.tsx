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
      {/* Pre-Filing Checklist */}
      <Paper elevation={0} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-8 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/peergos_slide_14.png)' }}
        />
        <Box className="relative z-10">
          <Typography variant="h6" className="text-gray-900 dark:text-white font-semibold mb-4">
            {t('filing.checklist.title', 'Pre-Filing Checklist')}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Filing;