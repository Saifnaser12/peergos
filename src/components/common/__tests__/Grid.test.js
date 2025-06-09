import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Grid } from '../Grid';
const theme = createTheme();
const TestWrapper = ({ children }) => (_jsx(ThemeProvider, { theme: theme, children: children }));
describe('Grid Component', () => {
    const renderWithTheme = (ui) => {
        return render(ui, { wrapper: TestWrapper });
    };
    it('renders children correctly', () => {
        renderWithTheme(_jsx(Grid, { children: _jsx("div", { children: "Test Content" }) }));
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
    it('applies container prop correctly', () => {
        const { container } = renderWithTheme(_jsx(Grid, { container: true, spacing: 2, children: _jsx("div", { children: "Test Content" }) }));
        expect(container.firstChild).toHaveClass('MuiGrid-root');
        expect(container.firstChild).toHaveClass('MuiGrid-container');
        expect(container.firstChild).toHaveClass('MuiGrid-spacing-xs-2');
    });
    it('applies responsive breakpoints correctly', () => {
        const { container } = renderWithTheme(_jsx(Grid, { container: true, children: _jsx(Grid, { size: { xs: 12, sm: 6, md: 4 }, children: _jsx("div", { children: "Test Content" }) }) }));
        const gridItem = container.firstChild?.firstChild;
        expect(gridItem).toHaveClass('MuiGrid-root');
        expect(gridItem).toHaveClass('MuiGrid-grid-xs-12');
        expect(gridItem).toHaveClass('MuiGrid-grid-sm-6');
        expect(gridItem).toHaveClass('MuiGrid-grid-md-4');
    });
    it('applies custom sx prop correctly', () => {
        const { container } = renderWithTheme(_jsx(Grid, { sx: { padding: 2, margin: 1 }, children: _jsx("div", { children: "Test Content" }) }));
        expect(container.firstChild).toHaveStyle({
            padding: '16px',
            margin: '8px'
        });
    });
    it('combines multiple props correctly', () => {
        const { container } = renderWithTheme(_jsx(Grid, { container: true, size: 12, spacing: 2, sx: { padding: 2 }, children: _jsx("div", { children: "Test Content" }) }));
        expect(container.firstChild).toHaveClass('MuiGrid-root');
        expect(container.firstChild).toHaveClass('MuiGrid-container');
        expect(container.firstChild).toHaveClass('MuiGrid-grid-xs-12');
        expect(container.firstChild).toHaveClass('MuiGrid-spacing-xs-2');
        expect(container.firstChild).toHaveStyle({ padding: '16px' });
    });
});
