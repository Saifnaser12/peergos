import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
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
        SecureStorage.get.mockImplementation((key) => {
            if (key === 'taxData')
                return mockTaxData;
            return null;
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('loads initial data from storage', () => {
        const TestComponent = () => {
            const { state } = useTax();
            return _jsx("div", { "data-testid": "test", children: state.revenues[0].amount });
        };
        const { getByTestId } = render(_jsx(TaxProvider, { children: _jsx(TestComponent, {}) }));
        expect(getByTestId('test').textContent).toBe('200000');
        expect(SecureStorage.get).toHaveBeenCalledWith('taxData');
    });
    it('saves state changes to storage', () => {
        const TestComponent = () => {
            const { dispatch } = useTax();
            return (_jsx("button", { onClick: () => dispatch({
                    type: 'ADD_REVENUE',
                    payload: {
                        id: '2',
                        date: '2024-02-01',
                        amount: 300000,
                        source: 'Services',
                        vatAmount: 15000
                    }
                }), children: "Add Revenue" }));
        };
        const { getByText } = render(_jsx(TaxProvider, { children: _jsx(TestComponent, {}) }));
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
            return (_jsxs(_Fragment, { children: [_jsx("div", { "data-testid": "amount", children: state.revenues[0].amount }), _jsx("button", { onClick: () => dispatch({
                            type: 'UPDATE_REVENUE',
                            payload: {
                                id: '1',
                                data: { amount: 250000 }
                            }
                        }), children: "Update Revenue" })] }));
        };
        const { getByText, getByTestId } = render(_jsx(TaxProvider, { children: _jsx(TestComponent, {}) }));
        expect(getByTestId('amount').textContent).toBe('200000');
        act(() => {
            getByText('Update Revenue').click();
        });
        expect(getByTestId('amount').textContent).toBe('250000');
    });
    it('deletes revenue entries', () => {
        const TestComponent = () => {
            const { state, dispatch } = useTax();
            return (_jsxs(_Fragment, { children: [_jsx("div", { "data-testid": "count", children: state.revenues.length }), _jsx("button", { onClick: () => dispatch({
                            type: 'DELETE_REVENUE',
                            payload: '1'
                        }), children: "Delete Revenue" })] }));
        };
        const { getByText, getByTestId } = render(_jsx(TaxProvider, { children: _jsx(TestComponent, {}) }));
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
            render(_jsx(TestComponent, {}));
        }).toThrow('useTax must be used within a TaxProvider');
        console.error = consoleError;
    });
});
