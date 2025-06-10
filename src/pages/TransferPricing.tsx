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
    </Container>
  );
};

export default TransferPricing;