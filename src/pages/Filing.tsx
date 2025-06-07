
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
