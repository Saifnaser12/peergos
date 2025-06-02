import React from 'react';
import { Paper, Typography } from '@mui/material';
import { Grid } from '../common/Grid';

export const GridTest: React.FC = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Paper>
          <Typography>Test Item 1</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper>
          <Typography>Test Item 2</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}; 