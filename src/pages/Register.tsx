import React from 'react';
import { Box, Typography, Paper, TextField, Button } from '@mui/material';

const Register: React.FC = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" gutterBottom align="center">
          Register
        </Typography>
        <TextField
          fullWidth
          label="Full Name"
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          variant="outlined"
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
        >
          Register
        </Button>
      </Paper>
    </Box>
  );
};

export default Register;