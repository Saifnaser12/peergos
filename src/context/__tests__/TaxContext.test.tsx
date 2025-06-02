import React from 'react';
import { render, act } from '@testing-library/react';
import { TaxProvider, useTax } from '../TaxContext';
import { SecureStorage } from '../../utils/storage';

// Mock the storage to prevent actual localStorage operations
jest.mock('../../utils/storage');

describe('TaxContext', () => {
  const mockTaxData = {
    revenues: [
      { id: '1', date: '2024-01-01', amount: 200000, source: 'Sales', vatAmount: 10000 }
    ],
    expenses: [
      { id: '1', date: '2024-01-15', amount: 100000, category: 'Operations' }
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

  it('loads initial data from storage', () => {
    const TestComponent = () => {
      const { state } = useTax();
      return <div data-testid="test">{state.revenues[0].amount}</div>;
    };

    const { getByTestId } = render(
      <TaxProvider>
        <TestComponent />
      </TaxProvider>
    );

    expect(getByTestId('test').textContent).toBe('200000');
    expect(SecureStorage.get).toHaveBeenCalledWith('taxData');
  });

  it('saves state changes to storage', () => {
    const TestComponent = () => {
      const { dispatch } = useTax();
      return (
        <button
          onClick={() =>
            dispatch({
              type: 'ADD_REVENUE',
              payload: {
                id: '2',
                date: '2024-02-01',
                amount: 300000,
                source: 'Services',
                vatAmount: 15000
              }
            })
          }
        >
          Add Revenue
        </button>
      );
    };

    const { getByText } = render(
      <TaxProvider>
        <TestComponent />
      </TaxProvider>
    );

    act(() => {
      getByText('Add Revenue').click();
    });

    expect(SecureStorage.set).toHaveBeenCalledWith('taxData', {
      revenues: [
        mockTaxData.revenues[0],
        {
          id: '2',
          date: '2024-02-01',
          amount: 300000,
          source: 'Services',
          vatAmount: 15000
        }
      ],
      expenses: mockTaxData.expenses
    });
  });

  it('updates existing revenue entries', () => {
    const TestComponent = () => {
      const { state, dispatch } = useTax();
      return (
        <>
          <div data-testid="amount">{state.revenues[0].amount}</div>
          <button
            onClick={() =>
              dispatch({
                type: 'UPDATE_REVENUE',
                payload: {
                  id: '1',
                  data: { amount: 250000 }
                }
              })
            }
          >
            Update Revenue
          </button>
        </>
      );
    };

    const { getByText, getByTestId } = render(
      <TaxProvider>
        <TestComponent />
      </TaxProvider>
    );

    expect(getByTestId('amount').textContent).toBe('200000');

    act(() => {
      getByText('Update Revenue').click();
    });

    expect(getByTestId('amount').textContent).toBe('250000');
  });

  it('deletes revenue entries', () => {
    const TestComponent = () => {
      const { state, dispatch } = useTax();
      return (
        <>
          <div data-testid="count">{state.revenues.length}</div>
          <button
            onClick={() =>
              dispatch({
                type: 'DELETE_REVENUE',
                payload: '1'
              })
            }
          >
            Delete Revenue
          </button>
        </>
      );
    };

    const { getByText, getByTestId } = render(
      <TaxProvider>
        <TestComponent />
      </TaxProvider>
    );

    expect(getByTestId('count').textContent).toBe('1');

    act(() => {
      getByText('Delete Revenue').click();
    });

    expect(getByTestId('count').textContent).toBe('0');
  });

  it('throws error when useTax is used outside TaxProvider', () => {
    const TestComponent = () => {
      useTax();
      return null;
    };

    const consoleError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTax must be used within a TaxProvider');

    console.error = consoleError;
  });
}); 