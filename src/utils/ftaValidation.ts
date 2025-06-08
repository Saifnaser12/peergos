
import { jsSHA } from 'jssha';

export interface FTAValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number;
}

export interface TaxInvoiceData {
  invoiceNumber: string;
  issueDate: string;
  sellerTRN: string;
  buyerTRN?: string;
  totalAmount: number;
  vatAmount: number;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  totalAmount: number;
}

export interface VATReturnData {
  trn: string;
  taxPeriod: string;
  standardRatedSupplies: number;
  zeroRatedSupplies: number;
  exemptSupplies: number;
  totalSupplies: number;
  standardRatedPurchases: number;
  imports: number;
  adjustments: number;
  vatDue: number;
}

export interface CITReturnData {
  trn: string;
  taxYear: string;
  revenue: number;
  deductibleExpenses: number;
  taxableIncome: number;
  citDue: number;
  advancePayments: number;
  penalties: number;
}

// TRN Validation
export const validateTRN = (trn: string): FTAValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Remove spaces and dashes
  const cleanTRN = trn.replace(/[\s-]/g, '');
  
  // Check length
  if (cleanTRN.length !== 15) {
    errors.push('TRN must be exactly 15 digits');
  }
  
  // Check if all characters are digits
  if (!/^\d{15}$/.test(cleanTRN)) {
    errors.push('TRN must contain only digits');
  }
  
  // Check TRN format (starts with 1, 2, or 3)
  if (cleanTRN.length === 15 && !['1', '2', '3'].includes(cleanTRN[0])) {
    errors.push('TRN must start with 1, 2, or 3');
  }
  
  // Validate check digit (simplified algorithm)
  if (cleanTRN.length === 15) {
    const checkDigit = calculateTRNCheckDigit(cleanTRN.substring(0, 14));
    if (checkDigit !== parseInt(cleanTRN[14])) {
      errors.push('Invalid TRN check digit');
    }
  }
  
  const score = errors.length === 0 ? 100 : Math.max(0, 100 - (errors.length * 25));
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score
  };
};

// Calculate TRN check digit (simplified algorithm)
const calculateTRNCheckDigit = (trnPrefix: string): number => {
  let sum = 0;
  for (let i = 0; i < trnPrefix.length; i++) {
    sum += parseInt(trnPrefix[i]) * (i + 1);
  }
  return sum % 10;
};

// Tax Invoice Validation
export const validateTaxInvoice = (invoice: TaxInvoiceData): FTAValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required fields validation
  if (!invoice.invoiceNumber || invoice.invoiceNumber.trim() === '') {
    errors.push('Invoice number is required');
  }
  
  if (!invoice.issueDate) {
    errors.push('Issue date is required');
  }
  
  if (!invoice.sellerTRN) {
    errors.push('Seller TRN is required');
  } else {
    const trnValidation = validateTRN(invoice.sellerTRN);
    if (!trnValidation.isValid) {
      errors.push(`Invalid seller TRN: ${trnValidation.errors.join(', ')}`);
    }
  }
  
  if (invoice.totalAmount <= 0) {
    errors.push('Total amount must be greater than zero');
  }
  
  if (invoice.vatAmount < 0) {
    errors.push('VAT amount cannot be negative');
  }
  
  // VAT calculation validation
  const calculatedVAT = invoice.items.reduce((sum, item) => {
    return sum + (item.totalAmount * item.vatRate / 100);
  }, 0);
  
  if (Math.abs(calculatedVAT - invoice.vatAmount) > 0.01) {
    warnings.push('VAT amount does not match calculated VAT from line items');
  }
  
  // Invoice number format validation
  if (invoice.invoiceNumber && !/^[A-Z0-9-]{1,20}$/.test(invoice.invoiceNumber)) {
    warnings.push('Invoice number should be alphanumeric and up to 20 characters');
  }
  
  // Date validation
  if (invoice.issueDate) {
    const issueDate = new Date(invoice.issueDate);
    const now = new Date();
    
    if (issueDate > now) {
      errors.push('Issue date cannot be in the future');
    }
    
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);
    
    if (issueDate < oneYearAgo) {
      warnings.push('Issue date is more than one year old');
    }
  }
  
  // Line items validation
  if (invoice.items.length === 0) {
    errors.push('Invoice must have at least one line item');
  }
  
  invoice.items.forEach((item, index) => {
    if (!item.description || item.description.trim() === '') {
      errors.push(`Line item ${index + 1}: Description is required`);
    }
    
    if (item.quantity <= 0) {
      errors.push(`Line item ${index + 1}: Quantity must be greater than zero`);
    }
    
    if (item.unitPrice < 0) {
      errors.push(`Line item ${index + 1}: Unit price cannot be negative`);
    }
    
    if (![0, 5].includes(item.vatRate)) {
      warnings.push(`Line item ${index + 1}: VAT rate should typically be 0% or 5%`);
    }
    
    const expectedTotal = item.quantity * item.unitPrice;
    if (Math.abs(expectedTotal - item.totalAmount) > 0.01) {
      errors.push(`Line item ${index + 1}: Total amount does not match quantity × unit price`);
    }
  });
  
  const score = Math.max(0, 100 - (errors.length * 15) - (warnings.length * 5));
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score
  };
};

// VAT Return Validation
export const validateVATReturn = (vatReturn: VATReturnData): FTAValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // TRN validation
  const trnValidation = validateTRN(vatReturn.trn);
  if (!trnValidation.isValid) {
    errors.push(`Invalid TRN: ${trnValidation.errors.join(', ')}`);
  }
  
  // Tax period validation
  if (!vatReturn.taxPeriod || !/^\d{4}-\d{2}$/.test(vatReturn.taxPeriod)) {
    errors.push('Tax period must be in YYYY-MM format');
  }
  
  // Amounts validation
  if (vatReturn.standardRatedSupplies < 0) {
    errors.push('Standard rated supplies cannot be negative');
  }
  
  if (vatReturn.zeroRatedSupplies < 0) {
    errors.push('Zero rated supplies cannot be negative');
  }
  
  if (vatReturn.exemptSupplies < 0) {
    errors.push('Exempt supplies cannot be negative');
  }
  
  // Total supplies calculation
  const calculatedTotal = vatReturn.standardRatedSupplies + vatReturn.zeroRatedSupplies + vatReturn.exemptSupplies;
  if (Math.abs(calculatedTotal - vatReturn.totalSupplies) > 0.01) {
    errors.push('Total supplies does not match sum of supply categories');
  }
  
  // VAT calculation
  const expectedVAT = vatReturn.standardRatedSupplies * 0.05;
  if (Math.abs(expectedVAT - vatReturn.vatDue) > 0.01) {
    warnings.push('VAT due does not match 5% of standard rated supplies');
  }
  
  // Period validation
  if (vatReturn.taxPeriod) {
    const [year, month] = vatReturn.taxPeriod.split('-').map(Number);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    if (year > currentYear || (year === currentYear && month > currentMonth)) {
      errors.push('Tax period cannot be in the future');
    }
    
    if (year < 2018) {
      errors.push('VAT was introduced in UAE in 2018');
    }
  }
  
  const score = Math.max(0, 100 - (errors.length * 20) - (warnings.length * 5));
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score
  };
};

// CIT Return Validation
export const validateCITReturn = (citReturn: CITReturnData): FTAValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // TRN validation
  const trnValidation = validateTRN(citReturn.trn);
  if (!trnValidation.isValid) {
    errors.push(`Invalid TRN: ${trnValidation.errors.join(', ')}`);
  }
  
  // Tax year validation
  if (!citReturn.taxYear || !/^\d{4}$/.test(citReturn.taxYear)) {
    errors.push('Tax year must be a 4-digit year');
  }
  
  // Revenue validation
  if (citReturn.revenue < 0) {
    errors.push('Revenue cannot be negative');
  }
  
  // Expenses validation
  if (citReturn.deductibleExpenses < 0) {
    errors.push('Deductible expenses cannot be negative');
  }
  
  if (citReturn.deductibleExpenses > citReturn.revenue) {
    warnings.push('Deductible expenses exceed revenue');
  }
  
  // Taxable income calculation
  const calculatedTaxableIncome = Math.max(0, citReturn.revenue - citReturn.deductibleExpenses - 375000);
  if (Math.abs(calculatedTaxableIncome - citReturn.taxableIncome) > 0.01) {
    errors.push('Taxable income calculation is incorrect (Revenue - Expenses - AED 375,000 threshold)');
  }
  
  // CIT calculation (9% on taxable income)
  const expectedCIT = citReturn.taxableIncome * 0.09;
  if (Math.abs(expectedCIT - citReturn.citDue) > 0.01) {
    errors.push('CIT due should be 9% of taxable income');
  }
  
  // Year validation
  if (citReturn.taxYear) {
    const year = parseInt(citReturn.taxYear);
    const currentYear = new Date().getFullYear();
    
    if (year > currentYear) {
      errors.push('Tax year cannot be in the future');
    }
    
    if (year < 2023) {
      errors.push('Corporate Income Tax was introduced in UAE in 2023');
    }
  }
  
  // Advance payments validation
  if (citReturn.advancePayments < 0) {
    errors.push('Advance payments cannot be negative');
  }
  
  if (citReturn.advancePayments > citReturn.citDue) {
    warnings.push('Advance payments exceed total CIT due');
  }
  
  const score = Math.max(0, 100 - (errors.length * 20) - (warnings.length * 5));
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score
  };
};

// Generate invoice hash for integrity (Phase 2 e-invoicing)
export const generateInvoiceHash = (invoice: TaxInvoiceData): string => {
  try {
    // Create a string representation of key invoice data
    const invoiceString = [
      invoice.invoiceNumber,
      invoice.issueDate,
      invoice.sellerTRN,
      invoice.buyerTRN || '',
      invoice.totalAmount.toFixed(2),
      invoice.vatAmount.toFixed(2)
    ].join('|');
    
    // Generate SHA-256 hash
    const shaObj = new jsSHA('SHA-256', 'TEXT');
    shaObj.update(invoiceString);
    return shaObj.getHash('HEX');
  } catch (error) {
    console.warn('Invoice hash generation failed:', error);
    return '';
  }
};

// Validate business rules
export const validateBusinessRules = (data: any, entityType: string): FTAValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  switch (entityType) {
    case 'INVOICE':
      // Minimum invoice amount for VAT
      if (data.totalAmount >= 1000 && data.vatAmount === 0) {
        warnings.push('Large transactions should typically include VAT');
      }
      
      // Round number detection
      if (data.totalAmount % 100 === 0 && data.totalAmount > 500) {
        warnings.push('Round number amounts may require additional documentation');
      }
      break;
      
    case 'VAT_RETURN':
      // Nil return validation
      if (data.totalSupplies === 0 && data.vatDue === 0) {
        warnings.push('Nil return - ensure this reflects actual business activity');
      }
      
      // Large VAT amounts
      if (data.vatDue > 50000) {
        warnings.push('Large VAT amount - ensure all supporting documentation is available');
      }
      break;
      
    case 'CIT_RETURN':
      // Loss carry forward
      if (data.taxableIncome < 0) {
        warnings.push('Consider loss carry forward provisions for future years');
      }
      
      // High profit margins
      const profitMargin = data.revenue > 0 ? ((data.revenue - data.deductibleExpenses) / data.revenue) * 100 : 0;
      if (profitMargin > 50) {
        warnings.push('High profit margin may require transfer pricing documentation');
      }
      break;
  }
  
  const score = Math.max(0, 100 - (errors.length * 25) - (warnings.length * 10));
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score
  };
};

// Complete FTA compliance check
export const performComplianceCheck = (data: any, entityType: string): FTAValidationResult => {
  let validationResult: FTAValidationResult;
  
  switch (entityType) {
    case 'TRN':
      validationResult = validateTRN(data);
      break;
    case 'INVOICE':
      validationResult = validateTaxInvoice(data);
      break;
    case 'VAT_RETURN':
      validationResult = validateVATReturn(data);
      break;
    case 'CIT_RETURN':
      validationResult = validateCITReturn(data);
      break;
    default:
      return {
        isValid: false,
        errors: ['Unknown entity type for validation'],
        warnings: [],
        score: 0
      };
  }
  
  // Add business rules validation
  const businessRulesResult = validateBusinessRules(data, entityType);
  
  return {
    isValid: validationResult.isValid && businessRulesResult.isValid,
    errors: [...validationResult.errors, ...businessRulesResult.errors],
    warnings: [...validationResult.warnings, ...businessRulesResult.warnings],
    score: Math.min(validationResult.score, businessRulesResult.score)
  };
};
