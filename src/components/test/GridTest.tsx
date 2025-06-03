import React from 'react';
import { Paper, Grid } from '@mui/material';

export const GridTest: React.FC = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Paper>Test Item 1</Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper>Test Item 2</Paper>
      </Grid>
    </Grid>
  );
}; 