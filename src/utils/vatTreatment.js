import { taxCategoryMapping } from './constants';
export class VATTreatmentHelper {
    /**
     * Get VAT treatment for a specific category
     */
    static getVATTreatment(category) {
        const mapping = taxCategoryMapping[category];
        if (!mapping) {
            // Default treatment for unknown categories
            return {
                vatApplicable: true,
                reverseCharge: false,
                vatRate: 5
            };
        }
        return {
            ...mapping,
            vatRate: mapping.vatApplicable ? 5 : 0,
            exemptionReason: !mapping.vatApplicable ? this.getExemptionReason(category) : undefined
        };
    }
    /**
     * Calculate VAT amount based on category and amount
     */
    static calculateVATAmount(category, amount, vatIncluded = false) {
        const treatment = this.getVATTreatment(category);
        if (!treatment.vatApplicable || treatment.vatRate === 0) {
            return 0;
        }
        if (vatIncluded) {
            // Extract VAT from amount that includes VAT
            return (amount * treatment.vatRate) / (100 + treatment.vatRate);
        }
        else {
            // Calculate VAT on amount excluding VAT
            return (amount * treatment.vatRate) / 100;
        }
    }
    /**
     * Validate if reverse charge mechanism applies
     */
    static requiresReverseCharge(category) {
        const treatment = this.getVATTreatment(category);
        return treatment.reverseCharge;
    }
    /**
     * Get exemption reason for non-VAT applicable categories
     */
    static getExemptionReason(category) {
        const exemptionReasons = {
            "Salaries and Wages": "Employment services exemption",
            "Interest Income": "Financial services exemption",
            "Bank Charges": "Financial services exemption",
            "Insurance": "Insurance services exemption",
            "Depreciation": "Accounting entry - not a supply",
            "VAT Paid": "VAT payment - not subject to VAT"
        };
        return exemptionReasons[category] || "Exempt supply";
    }
    /**
     * Generate VAT summary for a list of transactions
     */
    static generateVATSummary(transactions) {
        let totalVATOnSupplies = 0;
        let totalVATOnPurchases = 0;
        const reverseChargeTransactions = [];
        transactions.forEach(transaction => {
            const vatAmount = this.calculateVATAmount(transaction.category, transaction.amount);
            const requiresReverse = this.requiresReverseCharge(transaction.category);
            if (transaction.type === 'revenue') {
                totalVATOnSupplies += vatAmount;
            }
            else if (transaction.type === 'expense') {
                totalVATOnPurchases += vatAmount;
                if (requiresReverse && vatAmount > 0) {
                    reverseChargeTransactions.push({
                        category: transaction.category,
                        amount: transaction.amount,
                        vatAmount
                    });
                }
            }
        });
        return {
            totalVATOnSupplies,
            totalVATOnPurchases,
            netVATDue: totalVATOnSupplies - totalVATOnPurchases,
            reverseChargeTransactions
        };
    }
}
