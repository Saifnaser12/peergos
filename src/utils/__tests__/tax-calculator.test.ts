import { TaxCalculator } from '../calculations/tax';
import type { RevenueEntry, ExpenseEntry } from '../../types';

describe('TaxCalculator', () => {
  const mockRevenues: RevenueEntry[] = [
    { id: '1', date: '2024-01-01', amount: 200000, source: 'Sales', vatAmount: 10000 },
    { id: '2', date: '2024-02-01', amount: 300000, source: 'Services', vatAmount: 15000 }
  ];

  const mockExpenses: ExpenseEntry[] = [
    { id: '1', date: '2024-01-15', amount: 100000, category: 'Operations' },
    { id: '2', date: '2024-02-15', amount: 150000, category: 'Marketing' }
  ];

  describe('Basic Calculations', () => {
    it('calculates total revenue correctly', () => {
      const total = TaxCalculator.calculateTotalRevenue(mockRevenues);
      expect(total).toBe(500000);
    });

    it('calculates total expenses correctly', () => {
      const total = TaxCalculator.calculateTotalExpenses(mockExpenses);
      expect(total).toBe(250000);
    });

    it('calculates VAT correctly', () => {
      const vat = TaxCalculator.calculateVAT(mockRevenues);
      expect(vat).toBe(25000);
    });
  });

  describe('CIT Calculations', () => {
    it('returns 0 CIT for income below threshold', () => {
      const cit = TaxCalculator.calculateCIT(300000);
      expect(cit).toBe(0);
    });

    it('calculates CIT correctly for income above threshold', () => {
      const cit = TaxCalculator.calculateCIT(400000);
      // (400000 - 375000) * 0.09 = 2250
      expect(cit).toBe(2250);
    });
  });

  describe('Registration Requirements', () => {
    it('correctly determines VAT registration requirement', () => {
      const { vatRequired } = TaxCalculator.getRegistrationRequirements(400000);
      expect(vatRequired).toBe(true);
    });

    it('correctly determines CIT registration requirement', () => {
      const { citRequired } = TaxCalculator.getRegistrationRequirements(400000);
      expect(citRequired).toBe(true);
    });

    it('handles amounts below thresholds', () => {
      const requirements = TaxCalculator.getRegistrationRequirements(300000);
      expect(requirements).toEqual({
        vatRequired: false,
        citRequired: false
      });
    });
  });

  describe('Monthly Revenue Calculations', () => {
    it('groups revenues by month correctly', () => {
      const monthlyRevenue = TaxCalculator.calculateMonthlyRevenue(mockRevenues);
      expect(monthlyRevenue).toEqual([
        { month: '2024-01', amount: 200000 },
        { month: '2024-02', amount: 300000 }
      ]);
    });

    it('handles empty revenue array', () => {
      const monthlyRevenue = TaxCalculator.calculateMonthlyRevenue([]);
      expect(monthlyRevenue).toEqual([]);
    });
  });

  describe('Expense Category Analysis', () => {
    it('calculates expense breakdown by category', () => {
      const breakdown = TaxCalculator.calculateExpensesByCategory(mockExpenses);
      expect(breakdown).toEqual([
        {
          category: 'Marketing',
          amount: 150000,
          percentage: 60
        },
        {
          category: 'Operations',
          amount: 100000,
          percentage: 40
        }
      ]);
    });

    it('handles empty expenses array', () => {
      const breakdown = TaxCalculator.calculateExpensesByCategory([]);
      expect(breakdown).toEqual([]);
    });
  });

  describe('Tax Summary', () => {
    it('generates complete tax summary', () => {
      const summary = TaxCalculator.calculateTaxSummary(mockRevenues, mockExpenses);
      expect(summary).toEqual({
        totalRevenue: 500000,
        totalExpenses: 250000,
        netIncome: 250000,
        vatAmount: 25000,
        citAmount: 0,
        effectiveTaxRate: 10 // (25000 / 250000) * 100
      });
    });

    it('handles zero revenue and expenses', () => {
      const summary = TaxCalculator.calculateTaxSummary([], []);
      expect(summary).toEqual({
        totalRevenue: 0,
        totalExpenses: 0,
        netIncome: 0,
        vatAmount: 0,
        citAmount: 0,
        effectiveTaxRate: 0
      });
    });
  });
}); 