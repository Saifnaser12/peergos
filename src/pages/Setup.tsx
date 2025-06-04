import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Setup: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        System Setup
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Initial system configuration and setup wizard will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Setup;