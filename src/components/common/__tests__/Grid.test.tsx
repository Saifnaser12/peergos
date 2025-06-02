import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Grid } from '../Grid';

const theme = createTheme();

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
);

describe('Grid Component', () => {
  const renderWithTheme = (ui: React.ReactElement) => {
    return render(ui, { wrapper: TestWrapper });
  };

  it('renders children correctly', () => {
    renderWithTheme(
      <Grid>
        <div>Test Content</div>
      </Grid>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies container prop correctly', () => {
    const { container } = renderWithTheme(
      <Grid container spacing={2}>
        <div>Test Content</div>
      </Grid>
    );
    expect(container.firstChild).toHaveClass('MuiGrid-root');
    expect(container.firstChild).toHaveClass('MuiGrid-container');
    expect(container.firstChild).toHaveClass('MuiGrid-spacing-xs-2');
  });

  it('applies responsive breakpoints correctly', () => {
    const { container } = renderWithTheme(
      <Grid container>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <div>Test Content</div>
        </Grid>
      </Grid>
    );
    const gridItem = container.firstChild?.firstChild;
    expect(gridItem).toHaveClass('MuiGrid-root');
    expect(gridItem).toHaveClass('MuiGrid-grid-xs-12');
    expect(gridItem).toHaveClass('MuiGrid-grid-sm-6');
    expect(gridItem).toHaveClass('MuiGrid-grid-md-4');
  });

  it('applies custom sx prop correctly', () => {
    const { container } = renderWithTheme(
      <Grid sx={{ padding: 2, margin: 1 }}>
        <div>Test Content</div>
      </Grid>
    );
    expect(container.firstChild).toHaveStyle({
      padding: '16px',
      margin: '8px'
    });
  });

  it('combines multiple props correctly', () => {
    const { container } = renderWithTheme(
      <Grid
        container
        size={12}
        spacing={2}
        sx={{ padding: 2 }}
      >
        <div>Test Content</div>
      </Grid>
    );
    expect(container.firstChild).toHaveClass('MuiGrid-root');
    expect(container.firstChild).toHaveClass('MuiGrid-container');
    expect(container.firstChild).toHaveClass('MuiGrid-grid-xs-12');
    expect(container.firstChild).toHaveClass('MuiGrid-spacing-xs-2');
    expect(container.firstChild).toHaveStyle({ padding: '16px' });
  });
}); 