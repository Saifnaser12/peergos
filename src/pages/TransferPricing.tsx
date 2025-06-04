import React from 'react';
import { Container, Paper, Typography } from '@mui/material';
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
    </Container>
  );
};

export default TransferPricing;