import { Validator } from '../validation';
describe('Validator', () => {
    describe('TRN Validation', () => {
        it('validates correct TRN format', () => {
            const result = Validator.validateTRN('123456789012345');
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('rejects empty TRN', () => {
            const result = Validator.validateTRN('');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('TRN is required');
        });
        it('rejects TRN with invalid length', () => {
            const result = Validator.validateTRN('12345');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('TRN must be exactly 15 digits');
        });
        it('rejects TRN with non-numeric characters', () => {
            const result = Validator.validateTRN('12345abcde67890');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('TRN must be exactly 15 digits');
        });
    });
    describe('Email Validation', () => {
        it('validates correct email format', () => {
            const result = Validator.validateEmail('test@example.com');
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('rejects empty email', () => {
            const result = Validator.validateEmail('');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Email is required');
        });
        it('rejects invalid email format', () => {
            const result = Validator.validateEmail('invalid-email');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Invalid email format');
        });
    });
    describe('Phone Validation', () => {
        it('validates correct UAE phone format', () => {
            const validFormats = [
                '+971501234567',
                '00971501234567',
                '0501234567',
                '971501234567'
            ];
            validFormats.forEach(phone => {
                const result = Validator.validatePhone(phone);
                expect(result.isValid).toBe(true);
                expect(result.errors).toHaveLength(0);
            });
        });
        it('rejects empty phone number', () => {
            const result = Validator.validatePhone('');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Phone number is required');
        });
        it('rejects invalid UAE phone format', () => {
            const result = Validator.validatePhone('123456789');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Invalid UAE phone number format');
        });
    });
    describe('Amount Validation', () => {
        it('validates positive numbers', () => {
            const result = Validator.validateAmount(100);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('validates string numbers', () => {
            const result = Validator.validateAmount('100');
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('rejects negative numbers', () => {
            const result = Validator.validateAmount(-100);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Amount cannot be negative');
        });
        it('rejects non-numeric strings', () => {
            const result = Validator.validateAmount('invalid');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Amount must be a valid number');
        });
    });
    describe('Date Validation', () => {
        it('validates correct date format', () => {
            const result = Validator.validateDate('2024-01-01');
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('rejects empty date', () => {
            const result = Validator.validateDate('');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Date is required');
        });
        it('rejects invalid date format', () => {
            const result = Validator.validateDate('invalid-date');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Invalid date format');
        });
        it('rejects future dates', () => {
            const futureDate = new Date();
            futureDate.setFullYear(futureDate.getFullYear() + 1);
            const result = Validator.validateDate(futureDate.toISOString());
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Date cannot be in the future');
        });
    });
    describe('Revenue Entry Validation', () => {
        const validRevenue = {
            date: '2024-01-01',
            amount: 1000,
            source: 'Sales',
            vatAmount: 50,
            category: 'Sales'
        };
        it('validates correct revenue entry', () => {
            const result = Validator.validateRevenueEntry(validRevenue);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('validates revenue entry without VAT amount', () => {
            const { vatAmount, ...revenueWithoutVAT } = validRevenue;
            const result = Validator.validateRevenueEntry(revenueWithoutVAT);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('rejects revenue entry without required fields', () => {
            const result = Validator.validateRevenueEntry({});
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Date is required');
            expect(result.errors).toContain('Amount is required');
            expect(result.errors).toContain('Revenue source is required');
            expect(result.errors).toContain('Category is required');
        });
    });
    describe('Expense Entry Validation', () => {
        const validExpense = {
            date: '2024-01-01',
            amount: 1000,
            category: 'Operations',
            description: 'Office supplies',
            vatAmount: 50
        };
        it('validates correct expense entry', () => {
            const result = Validator.validateExpenseEntry(validExpense);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('validates expense entry without VAT amount', () => {
            const { vatAmount, ...expenseWithoutVAT } = validExpense;
            const result = Validator.validateExpenseEntry(expenseWithoutVAT);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('rejects expense entry without required fields', () => {
            const result = Validator.validateExpenseEntry({});
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Date is required');
            expect(result.errors).toContain('Amount is required');
            expect(result.errors).toContain('Expense category is required');
            expect(result.errors).toContain('Description is required');
        });
    });
    describe('Bulk Upload Validation', () => {
        const validRevenues = [
            {
                date: '2024-01-01',
                amount: 1000,
                source: 'Sales',
                vatAmount: 50
            },
            {
                date: '2024-01-02',
                amount: 2000,
                source: 'Services',
                vatAmount: 100
            }
        ];
        it('validates correct bulk revenue upload', () => {
            const result = Validator.validateBulkUpload(validRevenues, 'revenue');
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('provides row-specific errors for invalid entries', () => {
            const invalidRevenues = [
                { date: '2024-01-01' }, // Missing amount and source
                { amount: 1000 } // Missing date and source
            ];
            const result = Validator.validateBulkUpload(invalidRevenues, 'revenue');
            expect(result.isValid).toBe(false);
            expect(result.errors).toHaveLength(2);
            expect(result.errors[0]).toContain('Row 1');
            expect(result.errors[1]).toContain('Row 2');
        });
    });
});
