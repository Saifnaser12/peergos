
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Typography, Box } from '@mui/material';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {t('welcome')} to Peergos Tax System
        </Typography>
        <Typography variant="body1">
          Your comprehensive tax management solution.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;
