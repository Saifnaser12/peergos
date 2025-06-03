import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Filing from '../../pages/Filing';
import { TaxProvider } from '../../context/TaxContext';
import { SecureStorage } from '../../utils/storage';

// Mock the storage to prevent actual localStorage operations
jest.mock('../../utils/storage');

describe('Filing Flow Integration', () => {
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
    (SecureStorage.get as jest.Mock).mockImplementation((key) => {
      if (key === 'taxData') return mockTaxData;
      return null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('completes the full filing flow', async () => {
    render(
      <TaxProvider>
        <Filing />
      </TaxProvider>
    );

    // Step 1: Initial Form
    await waitFor(() => {
      expect(screen.getByText('Tax Filing Period')).toBeInTheDocument();
    });

    // Select filing period
    const periodSelect = screen.getByLabelText('Filing Period');
    fireEvent.change(periodSelect, { target: { value: '2024-Q1' } });

    // Fill TRN
    const trnInput = screen.getByLabelText('Tax Registration Number (TRN)');
    await userEvent.type(trnInput, '123456789012345');

    // Proceed to next step
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Step 2: Revenue Review
    await waitFor(() => {
      expect(screen.getByText('Revenue Summary')).toBeInTheDocument();
    });

    // Verify revenue data is displayed
    expect(screen.getByText('500,000 AED')).toBeInTheDocument(); // Total revenue
    expect(screen.getByText('25,000 AED')).toBeInTheDocument(); // Total VAT

    // Proceed to next step
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Step 3: Expense Review
    await waitFor(() => {
      expect(screen.getByText('Expense Summary')).toBeInTheDocument();
    });

    // Verify expense data is displayed
    expect(screen.getByText('250,000 AED')).toBeInTheDocument(); // Total expenses

    // Proceed to next step
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Step 4: Summary & Declaration
    await waitFor(() => {
      expect(screen.getByText('Filing Summary')).toBeInTheDocument();
    });

    // Verify summary calculations
    expect(screen.getByText('Net Income: 250,000 AED')).toBeInTheDocument();
    expect(screen.getByText('VAT Payable: 25,000 AED')).toBeInTheDocument();

    // Accept declaration
    const declarationCheckbox = screen.getByRole('checkbox', {
      name: /I declare that the information provided is true and accurate/i
    });
    fireEvent.click(declarationCheckbox);

    // Submit filing
    const submitButton = screen.getByRole('button', { name: /submit filing/i });
    fireEvent.click(submitButton);

    // Verify success message
    await waitFor(() => {
      expect(screen.getByText('Filing Submitted Successfully')).toBeInTheDocument();
    });

    // Verify storage operations
    expect(SecureStorage.set).toHaveBeenCalledWith(
      'filings',
      expect.arrayContaining([
        expect.objectContaining({
          period: '2024-Q1',
          trn: '123456789012345',
          totalRevenue: 500000,
          totalExpenses: 250000,
          vatPayable: 25000
        })
      ])
    );
  });

  it('handles validation errors appropriately', async () => {
    render(
      <TaxProvider>
        <Filing />
      </TaxProvider>
    );

    // Try to proceed without filling required fields
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Verify validation errors
    expect(screen.getByText('Filing Period is required')).toBeInTheDocument();
    expect(screen.getByText('TRN is required')).toBeInTheDocument();

    // Fill invalid TRN
    const trnInput = screen.getByLabelText('Tax Registration Number (TRN)');
    await userEvent.type(trnInput, '12345'); // Too short

    // Verify TRN validation error
    expect(screen.getByText('TRN must be exactly 15 digits')).toBeInTheDocument();
  });

  it('saves draft filing', async () => {
    render(
      <TaxProvider>
        <Filing />
      </TaxProvider>
    );

    // Fill some data
    const periodSelect = screen.getByLabelText('Filing Period');
    fireEvent.change(periodSelect, { target: { value: '2024-Q1' } });

    // Click save draft
    const saveDraftButton = screen.getByRole('button', { name: /save draft/i });
    fireEvent.click(saveDraftButton);

    // Verify draft saved
    expect(SecureStorage.set).toHaveBeenCalledWith(
      'draftFiling',
      expect.objectContaining({
        period: '2024-Q1',
        lastUpdated: expect.any(String)
      })
    );

    // Verify success message
    expect(screen.getByText('Draft Saved')).toBeInTheDocument();
  });
}); 