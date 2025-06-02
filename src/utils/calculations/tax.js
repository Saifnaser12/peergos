export class TaxCalculator {
    static calculateTotalRevenue(revenues) {
        return revenues.reduce((sum, entry) => sum + entry.amount, 0);
    }
    static calculateTotalExpenses(expenses) {
        return expenses.reduce((sum, entry) => sum + entry.amount, 0);
    }
    static calculateVAT(revenues) {
        return revenues.reduce((sum, entry) => sum + (entry.vatAmount || 0), 0);
    }
    static calculateCIT(netIncome) {
        if (netIncome <= this.CIT_THRESHOLD) {
            return 0;
        }
        return (netIncome - this.CIT_THRESHOLD) * this.CIT_RATE;
    }
    static calculateEffectiveTaxRate(totalTax, netIncome) {
        return netIncome > 0 ? (totalTax / netIncome) * 100 : 0;
    }
    static getRegistrationRequirements(totalRevenue) {
        return {
            vatRequired: totalRevenue > this.VAT_THRESHOLD,
            citRequired: totalRevenue > this.CIT_THRESHOLD
        };
    }
    static calculateMonthlyRevenue(revenues) {
        const monthlyMap = new Map();
        revenues.forEach(entry => {
            const date = new Date(entry.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + entry.amount);
        });
        return Array.from(monthlyMap.entries())
            .map(([month, amount]) => ({ month, amount }))
            .sort((a, b) => a.month.localeCompare(b.month));
    }
    static calculateExpensesByCategory(expenses) {
        const categoryMap = new Map();
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
    static calculateTaxSummary(revenues, expenses) {
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
Object.defineProperty(TaxCalculator, "VAT_RATE", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 0.05
}); // 5%
Object.defineProperty(TaxCalculator, "CIT_RATE", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 0.09
}); // 9%
Object.defineProperty(TaxCalculator, "CIT_THRESHOLD", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 375000
});
Object.defineProperty(TaxCalculator, "VAT_THRESHOLD", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 375000
});
