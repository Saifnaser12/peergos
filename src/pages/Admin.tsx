
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Admin: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Administration
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          System administration and user management features will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Admin;
