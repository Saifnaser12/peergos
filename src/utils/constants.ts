// Revenue categories with smart suggestions
export const revenueCategories = [
  'sales',
  'services',
  'consulting',
  'licensing',
  'subscription',
  'commission',
  'rental',
  'investment',
  'other'
];

// Expense categories  
export const expenseCategories = [
  'rent',
  'utilities',
  'salaries',
  'marketing',
  'supplies',
  'travel',
  'meals',
  'professional-services',
  'insurance',
  'depreciation',
  'interest',
  'taxes',
  'other'
];

// Smart category suggestions with icons and colors
export const categoryConfig = {
  revenue: {
    sales: { icon: '🛒', color: '#10B981', keywords: ['sale', 'product', 'goods', 'retail'] },
    services: { icon: '🔧', color: '#3B82F6', keywords: ['service', 'support', 'maintenance', 'repair'] },
    consulting: { icon: '🧾', color: '#8B5CF6', keywords: ['consult', 'advice', 'advisory', 'expert'] },
    licensing: { icon: '📋', color: '#F59E0B', keywords: ['license', 'royalty', 'patent', 'trademark'] },
    subscription: { icon: '📱', color: '#06B6D4', keywords: ['subscription', 'recurring', 'monthly', 'annual'] },
    commission: { icon: '💰', color: '#EF4444', keywords: ['commission', 'referral', 'affiliate', 'broker'] },
    rental: { icon: '🏢', color: '#84CC16', keywords: ['rent', 'lease', 'property', 'space'] },
    investment: { icon: '📈', color: '#F97316', keywords: ['investment', 'dividend', 'interest', 'capital'] },
    other: { icon: '📦', color: '#6B7280', keywords: ['other', 'misc', 'various'] }
  },
  expense: {
    rent: { icon: '🏢', color: '#EF4444', keywords: ['rent', 'lease', 'property', 'office'] },
    utilities: { icon: '⚡', color: '#F59E0B', keywords: ['utility', 'electric', 'water', 'internet', 'phone'] },
    salaries: { icon: '👥', color: '#10B981', keywords: ['salary', 'wage', 'payroll', 'staff', 'employee'] },
    marketing: { icon: '📢', color: '#8B5CF6', keywords: ['marketing', 'advertising', 'promotion', 'campaign'] },
    supplies: { icon: '📝', color: '#06B6D4', keywords: ['supply', 'stationery', 'materials', 'equipment'] },
    travel: { icon: '✈️', color: '#3B82F6', keywords: ['travel', 'flight', 'hotel', 'transport', 'trip'] },
    meals: { icon: '🍽️', color: '#84CC16', keywords: ['meal', 'food', 'restaurant', 'catering', 'lunch'] },
    'professional-services': { icon: '⚖️', color: '#F97316', keywords: ['legal', 'audit', 'accounting', 'consultant'] },
    insurance: { icon: '🛡️', color: '#6366F1', keywords: ['insurance', 'coverage', 'policy', 'premium'] },
    depreciation: { icon: '📉', color: '#64748B', keywords: ['depreciation', 'amortization', 'asset'] },
    interest: { icon: '🏦', color: '#DC2626', keywords: ['interest', 'bank', 'loan', 'finance'] },
    taxes: { icon: '🧾', color: '#059669', keywords: ['tax', 'vat', 'corporate', 'government'] },
    other: { icon: '📦', color: '#6B7280', keywords: ['other', 'misc', 'various', 'general'] }
  }
};

// Smart suggestion function
export const getSuggestions = (input: string, type: 'revenue' | 'expense'): string[] => {
  if (input.length < 2) return [];

  const config = categoryConfig[type];
  const suggestions: string[] = [];

  Object.entries(config).forEach(([category, data]) => {
    const matches = data.keywords.some(keyword => 
      keyword.toLowerCase().includes(input.toLowerCase()) ||
      category.toLowerCase().includes(input.toLowerCase())
    );

    if (matches) {
      suggestions.push(category);
    }
  });

  return suggestions.slice(0, 5); // Limit to 5 suggestions
};

// Translation keys for revenue categories
export const revenueCategoryTranslations = {
  "Product Sales": "accounting.revenue.categories.productSales",
  "Service Income": "accounting.revenue.categories.serviceIncome",
  "Rental Income": "accounting.revenue.categories.rentalIncome",
  "Consulting Fees": "accounting.revenue.categories.consultingFees",
  "Commission Income": "accounting.revenue.categories.commissionIncome",
  "Interest Income": "accounting.revenue.categories.interestIncome",
  "Other Revenue": "accounting.revenue.categories.otherRevenue"
};

// Translation keys for expense categories
export const expenseCategoryTranslations = {
  "Cost of Goods Sold": "accounting.expenses.categories.costOfGoodsSold",
  "Salaries and Wages": "accounting.expenses.categories.salariesAndWages",
  "Rent": "accounting.expenses.categories.rent",
  "Utilities": "accounting.expenses.categories.utilities",
  "Marketing and Advertising": "accounting.expenses.categories.marketingAndAdvertising",
  "Software Subscriptions": "accounting.expenses.categories.softwareSubscriptions",
  "Professional Services": "accounting.expenses.categories.professionalServices",
  "Office Supplies": "accounting.expenses.categories.officeSupplies",
  "Bank Charges": "accounting.expenses.categories.bankCharges",
  "Insurance": "accounting.expenses.categories.insurance",
  "Travel and Meals": "accounting.expenses.categories.travelAndMeals",
  "Depreciation": "accounting.expenses.categories.depreciation",
  "VAT Paid": "accounting.expenses.categories.vatPaid",
  "Other Expenses": "accounting.expenses.categories.otherExpenses"
};

// Tax category mapping for VAT compliance and XML generation
export const taxCategoryMapping = {
  // Revenue categories
  "Product Sales": { vatApplicable: true, reverseCharge: false },
  "Service Income": { vatApplicable: true, reverseCharge: false },
  "Rental Income": { vatApplicable: true, reverseCharge: false },
  "Consulting Fees": { vatApplicable: true, reverseCharge: false },
  "Commission Income": { vatApplicable: true, reverseCharge: false },
  "Interest Income": { vatApplicable: false, reverseCharge: false }, // Financial services exemption
  "Other Revenue": { vatApplicable: true, reverseCharge: false },

  // Expense categories
  "Cost of Goods Sold": { vatApplicable: true, reverseCharge: false },
  "Salaries and Wages": { vatApplicable: false, reverseCharge: false }, // No VAT on salaries
  "Rent": { vatApplicable: true, reverseCharge: false },
  "Utilities": { vatApplicable: true, reverseCharge: false },
  "Marketing and Advertising": { vatApplicable: true, reverseCharge: false },
  "Software Subscriptions": { vatApplicable: true, reverseCharge: true }, // Often foreign suppliers
  "Professional Services": { vatApplicable: true, reverseCharge: true }, // May include foreign suppliers
  "Office Supplies": { vatApplicable: true, reverseCharge: false },
  "Bank Charges": { vatApplicable: false, reverseCharge: false }, // Financial services exemption
  "Insurance": { vatApplicable: false, reverseCharge: false }, // Insurance exemption
  "Travel and Meals": { vatApplicable: true, reverseCharge: false },
  "Depreciation": { vatApplicable: false, reverseCharge: false }, // Accounting entry, no VAT
  "VAT Paid": { vatApplicable: false, reverseCharge: false }, // VAT payment itself
  "Other Expenses": { vatApplicable: true, reverseCharge: false }
};

// FTA Income Classification per Article 18 & Cabinet Decision No. 55
export const FTA_INCOME_CLASSIFICATION = {
  QUALIFYING_ACTIVITIES: {
    'export-services': {
      name: 'Export of Goods/Services',
      description: 'Export transactions outside UAE mainland',
      citRate: 0,
      autoClassify: true
    },
    'intra-zone-trade': {
      name: 'Intra-Free Zone Trade',
      description: 'Trade between Free Zone entities',
      citRate: 0,
      autoClassify: true
    },
    'qualifying-activities': {
      name: 'Other Qualifying Activities',
      description: 'Per FTA qualifying activities list',
      citRate: 0,
      autoClassify: true
    }
  },
  NON_QUALIFYING_ACTIVITIES: {
    'mainland-sales': {
      name: 'Mainland/Domestic Sales',
      description: 'Sales to UAE mainland market',
      citRate: 9,
      autoClassify: true
    },
    'local-consumption': {
      name: 'Local Consumption',
      description: 'Goods/services consumed in UAE',
      citRate: 9,
      autoClassify: true
    },
    'other-income': {
      name: 'Other Income',
      description: 'Non-qualifying business income',
      citRate: 9,
      autoClassify: false
    }
  }
};

// De Minimis Thresholds per Cabinet Decision No. 55
export const DE_MINIMIS_THRESHOLDS = {
  PERCENTAGE_LIMIT: 5, // 5% of total income
  AMOUNT_LIMIT: 5000000, // AED 5 million
};

// Free Zone Income Classification
export const freeZoneIncomeTypes = [
  'qualifying',
  'non-qualifying'
];

export const freeZoneIncomeSubcategories = {
  qualifying: [
    'exports',
    'intraZoneTrade',
    'servicesOutsideUAE',
    'intellectualProperty',
    'financialServices'
  ],
  'non-qualifying': [
    'mainlandSales',
    'servicesInUAE',
    'domesticConsumption',
    'localMarketSales'
  ]
};

export const freeZoneIncomeTranslations = {
  qualifying: 'accounting.revenue.freeZone.qualifying',
  'non-qualifying': 'accounting.revenue.freeZone.nonQualifying',
  exports: 'accounting.revenue.freeZone.subcategories.exports',
  intraZoneTrade: 'accounting.revenue.freeZone.subcategories.intraZoneTrade',
  servicesOutsideUAE: 'accounting.revenue.freeZone.subcategories.servicesOutsideUAE',
  intellectualProperty: 'accounting.revenue.freeZone.subcategories.intellectualProperty',
  financialServices: 'accounting.revenue.freeZone.subcategories.financialServices',
  mainlandSales: 'accounting.revenue.freeZone.subcategories.mainlandSales',
  servicesInUAE: 'accounting.revenue.freeZone.subcategories.servicesInUAE',
  domesticConsumption: 'accounting.revenue.freeZone.subcategories.domesticConsumption',
  localMarketSales: 'accounting.revenue.freeZone.subcategories.localMarketSales'
};

// Free Zone Compliance Thresholds
export const FREE_ZONE_THRESHOLDS = {
  DE_MINIMIS_PERCENTAGE: 5, // 5%
  DE_MINIMIS_AMOUNT: 5000000 // AED 5 million
};