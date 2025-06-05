import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Paper } from '@mui/material';

const Filing: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('taxFiling.title')}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          {t('taxFiling.description')}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Filing;