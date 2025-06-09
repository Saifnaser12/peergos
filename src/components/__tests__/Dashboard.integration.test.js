import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashboardPage } from '../../pages/DashboardPage';
import { TaxProvider } from '../../context/TaxContext';
import { SecureStorage } from '../../utils/storage';
// Mock the storage to prevent actual localStorage operations
jest.mock('../../utils/storage');
// Mock the recharts library
jest.mock('recharts', () => ({
    ResponsiveContainer: ({ children }) => (_jsx("div", { "data-testid": "responsive-container", children: children })),
    LineChart: ({ children }) => (_jsx("div", { "data-testid": "line-chart", children: children })),
    Line: () => _jsx("div", { "data-testid": "line" }),
    XAxis: () => _jsx("div", { "data-testid": "x-axis" }),
    YAxis: () => _jsx("div", { "data-testid": "y-axis" }),
    CartesianGrid: () => _jsx("div", { "data-testid": "cartesian-grid" }),
    Tooltip: () => _jsx("div", { "data-testid": "tooltip" }),
    Legend: () => _jsx("div", { "data-testid": "legend" }),
    PieChart: ({ children }) => (_jsx("div", { "data-testid": "pie-chart", children: children })),
    Pie: () => _jsx("div", { "data-testid": "pie" }),
    Cell: () => _jsx("div", { "data-testid": "cell" })
}));
describe('Dashboard Integration', () => {
    const mockTaxData = {
        revenues: [
            { id: '1', date: '2024-01-01', amount: 200000, source: 'Sales', vatAmount: 10000 },
            { id: '2', date: '2024-02-01', amount: 300000, source: 'Services', vatAmount: 15000 }
        ],
        expenses: [
            { id: '1', date: '2024-01-15', amount: 100000, category: 'Operations' },
            { id: '2', date: '2024-02-15', amount: 150000, category: 'Marketing' }
        ]
    };
    beforeEach(() => {
        // Mock storage get to return our test data
        SecureStorage.get.mockImplementation((key) => {
            if (key === 'taxData')
                return mockTaxData;
            return null;
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('renders dashboard with all key metrics', async () => {
        render(_jsx(TaxProvider, { children: _jsx(DashboardPage, {}) }));
        // Check for key metrics
        await waitFor(() => {
            expect(screen.getByText('Total Revenue')).toBeInTheDocument();
            expect(screen.getByText('500,000 AED')).toBeInTheDocument(); // Total revenue
            expect(screen.getByText('250,000 AED')).toBeInTheDocument(); // Total expenses
            expect(screen.getByText('25,000 AED')).toBeInTheDocument(); // Total VAT
        });
        // Check for charts
        expect(screen.getByTestId('revenue-trend-chart')).toBeInTheDocument();
        expect(screen.getByTestId('expense-breakdown-chart')).toBeInTheDocument();
    });
    it('handles date range filtering', async () => {
        render(_jsx(TaxProvider, { children: _jsx(DashboardPage, {}) }));
        // Open date picker
        const dateRangeButton = screen.getByRole('button', { name: /date range/i });
        fireEvent.click(dateRangeButton);
        // Select custom date range
        const startDateInput = screen.getByLabelText('Start Date');
        const endDateInput = screen.getByLabelText('End Date');
        await userEvent.type(startDateInput, '2024-01-01');
        await userEvent.type(endDateInput, '2024-01-31');
        const applyButton = screen.getByRole('button', { name: /apply/i });
        fireEvent.click(applyButton);
        // Check filtered metrics
        await waitFor(() => {
            expect(screen.getByText('200,000 AED')).toBeInTheDocument(); // Filtered revenue
            expect(screen.getByText('100,000 AED')).toBeInTheDocument(); // Filtered expenses
            expect(screen.getByText('10,000 AED')).toBeInTheDocument(); // Filtered VAT
        });
    });
    it('exports dashboard data', async () => {
        render(_jsx(TaxProvider, { children: _jsx(DashboardPage, {}) }));
        // Click export button
        const exportButton = screen.getByRole('button', { name: /export/i });
        fireEvent.click(exportButton);
        // Verify export started message
        await waitFor(() => {
            expect(screen.getByText('Export Started')).toBeInTheDocument();
        });
    });
    it('displays tax registration alerts', async () => {
        render(_jsx(TaxProvider, { children: _jsx(DashboardPage, {}) }));
        // With our mock data (500,000 AED revenue), should show VAT and CIT registration alerts
        await waitFor(() => {
            expect(screen.getByText(/vat registration required/i)).toBeInTheDocument();
            expect(screen.getByText(/corporate income tax registration required/i)).toBeInTheDocument();
        });
    });
    it('updates metrics when new data is added', async () => {
        const { rerender } = render(_jsx(TaxProvider, { children: _jsx(DashboardPage, {}) }));
        // Initial metrics
        expect(screen.getByText('500,000 AED')).toBeInTheDocument();
        // Update mock data
        const updatedMockData = {
            ...mockTaxData,
            revenues: [
                ...mockTaxData.revenues,
                { id: '3', date: '2024-03-01', amount: 200000, source: 'Consulting', vatAmount: 10000 }
            ]
        };
        SecureStorage.get.mockImplementation((key) => {
            if (key === 'taxData')
                return updatedMockData;
            return null;
        });
        // Rerender with updated data
        rerender(_jsx(TaxProvider, { children: _jsx(DashboardPage, {}) }));
        // Check updated metrics
        await waitFor(() => {
            expect(screen.getByText('700,000 AED')).toBeInTheDocument(); // Updated total revenue
            expect(screen.getByText('35,000 AED')).toBeInTheDocument(); // Updated total VAT
        });
    });
});
