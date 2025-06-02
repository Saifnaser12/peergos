import type { RevenueEntry, ExpenseEntry } from '../../types';

export interface TaxCalculationResult {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  vatAmount: number;
  citAmount: number;
  effectiveTaxRate: number;
}

export class TaxCalculator {
  private static readonly VAT_RATE = 0.05; // 5%
  private static readonly CIT_RATE = 0.09; // 9%
  private static readonly CIT_THRESHOLD = 375000;
  private static readonly VAT_THRESHOLD = 375000;

  static calculateTotalRevenue(revenues: RevenueEntry[]): number {
    return revenues.reduce((sum, entry) => sum + entry.amount, 0);
  }

  static calculateTotalExpenses(expenses: ExpenseEntry[]): number {
    return expenses.reduce((sum, entry) => sum + entry.amount, 0);
  }

  static calculateVAT(revenues: RevenueEntry[]): number {
    return revenues.reduce((sum, entry) => sum + (entry.vatAmount || 0), 0);
  }

  static calculateCIT(netIncome: number): number {
    if (netIncome <= this.CIT_THRESHOLD) {
      return 0;
    }
    return (netIncome - this.CIT_THRESHOLD) * this.CIT_RATE;
  }

  static calculateEffectiveTaxRate(totalTax: number, netIncome: number): number {
    return netIncome > 0 ? (totalTax / netIncome) * 100 : 0;
  }

  static getRegistrationRequirements(totalRevenue: number): {
    vatRequired: boolean;
    citRequired: boolean;
  } {
    return {
      vatRequired: totalRevenue > this.VAT_THRESHOLD,
      citRequired: totalRevenue > this.CIT_THRESHOLD
    };
  }

  static calculateMonthlyRevenue(revenues: RevenueEntry[]): Array<{
    month: string;
    amount: number;
  }> {
    const monthlyMap = new Map<string, number>();
    
    revenues.forEach(entry => {
      const date = new Date(entry.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + entry.amount);
    });

    return Array.from(monthlyMap.entries())
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  static calculateExpensesByCategory(expenses: ExpenseEntry[]): Array<{
    category: string;
    amount: number;
    percentage: number;
  }> {
    const categoryMap = new Map<string, number>();
    const totalExpenses = this.calculateTotalExpenses(expenses);

    expenses.forEach(entry => {
      categoryMap.set(entry.category, (categoryMap.get(entry.category) || 0) + entry.amount);
    });

    return Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  static calculateTaxSummary(revenues: RevenueEntry[], expenses: ExpenseEntry[]): TaxCalculationResult {
    const totalRevenue = this.calculateTotalRevenue(revenues);
    const totalExpenses = this.calculateTotalExpenses(expenses);
    const netIncome = totalRevenue - totalExpenses;
    const vatAmount = this.calculateVAT(revenues);
    const citAmount = this.calculateCIT(netIncome);
    const totalTax = vatAmount + citAmount;
    const effectiveTaxRate = this.calculateEffectiveTaxRate(totalTax, netIncome);

    return {
      totalRevenue,
      totalExpenses,
      netIncome,
      vatAmount,
      citAmount,
      effectiveTaxRate
    };
  }
} 