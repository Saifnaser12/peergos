export class Validator {
    static validateTRN(trn) {
        const errors = [];
        if (!trn) {
            errors.push('TRN is required');
        }
        else {
            // TRN format: 15 digits
            if (!/^\d{15}$/.test(trn)) {
                errors.push('TRN must be exactly 15 digits');
            }
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    static validateEmail(email) {
        const errors = [];
        if (!email) {
            errors.push('Email is required');
        }
        else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.push('Invalid email format');
            }
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    static validatePhone(phone) {
        const errors = [];
        if (!phone) {
            errors.push('Phone number is required');
        }
        else {
            // Basic UAE phone format
            const phoneRegex = /^(\+971|00971|0)?(?:50|51|52|55|56|58|2|3|4|6|7|9)\d{7}$/;
            if (!phoneRegex.test(phone)) {
                errors.push('Invalid UAE phone number format');
            }
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    static validateAmount(amount) {
        const errors = [];
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (isNaN(numAmount)) {
            errors.push('Amount must be a valid number');
        }
        else if (numAmount < 0) {
            errors.push('Amount cannot be negative');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    static validateDate(date) {
        const errors = [];
        if (!date) {
            errors.push('Date is required');
        }
        else {
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                errors.push('Invalid date format');
            }
            else if (dateObj > new Date()) {
                errors.push('Date cannot be in the future');
            }
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    static validateRevenueEntry(entry) {
        const errors = [];
        if (!entry.date) {
            errors.push('Date is required');
        }
        else {
            const dateValidation = this.validateDate(entry.date);
            errors.push(...dateValidation.errors);
        }
        if (!entry.amount && entry.amount !== 0) {
            errors.push('Amount is required');
        }
        else {
            const amountValidation = this.validateAmount(entry.amount);
            errors.push(...amountValidation.errors);
        }
        if (!entry.source) {
            errors.push('Revenue source is required');
        }
        if (!entry.category) {
            errors.push('Category is required');
        }
        if (entry.vatAmount !== undefined) {
            const vatValidation = this.validateAmount(entry.vatAmount);
            if (!vatValidation.isValid) {
                errors.push('Invalid VAT amount');
            }
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    static validateExpenseEntry(entry) {
        const errors = [];
        if (!entry.date) {
            errors.push('Date is required');
        }
        else {
            const dateValidation = this.validateDate(entry.date);
            errors.push(...dateValidation.errors);
        }
        if (!entry.amount && entry.amount !== 0) {
            errors.push('Amount is required');
        }
        else {
            const amountValidation = this.validateAmount(entry.amount);
            errors.push(...amountValidation.errors);
        }
        if (!entry.category) {
            errors.push('Expense category is required');
        }
        if (!entry.description) {
            errors.push('Description is required');
        }
        if (entry.vatAmount !== undefined) {
            const vatValidation = this.validateAmount(entry.vatAmount);
            if (!vatValidation.isValid) {
                errors.push('Invalid VAT amount');
            }
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    static validateBulkUpload(entries, type) {
        const errors = [];
        entries.forEach((entry, index) => {
            const validation = type === 'revenue'
                ? this.validateRevenueEntry(entry)
                : this.validateExpenseEntry(entry);
            if (!validation.isValid) {
                errors.push(`Row ${index + 1}: ${validation.errors.join(', ')}`);
            }
        });
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}
