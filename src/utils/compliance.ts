import type { CompanyProfile, RevenueEntry, ExpenseEntry } from '../types';

interface ComplianceMetrics {
  score: number;
  issues: string[];
  recommendations: string[];
}

export const calculateComplianceScore = (data: {
  profile: CompanyProfile;
  revenues: RevenueEntry[];
  expenses: ExpenseEntry[];
}): ComplianceMetrics => {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Check profile completeness
  if (!data.profile.email) {
    score -= 5;
    issues.push('Missing email contact');
  }
  if (!data.profile.phone) {
    score -= 5;
    issues.push('Missing phone contact');
  }
  if (!data.profile.address) {
    score -= 5;
    issues.push('Missing business address');
  }

  // Check VAT registration compliance
  const totalRevenue = data.revenues.reduce((sum, entry) => sum + entry.amount, 0);
  if (totalRevenue > 375000 && !data.profile.vatRegistered) {
    score -= 20;
    issues.push('VAT registration required but not completed');
    recommendations.push('Register for VAT immediately as threshold is exceeded');
  }

  // Check CIT registration compliance
  if (totalRevenue > 3000000 && !data.profile.citRegistered) {
    score -= 20;
    issues.push('CIT registration required but not completed');
    recommendations.push('Register for Corporate Income Tax as threshold is exceeded');
  }

  // Check transaction documentation
  const hasRecentTransactions = data.revenues.some(entry => {
    const entryDate = new Date(entry.date);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return entryDate >= threeMonthsAgo;
  });

  if (!hasRecentTransactions) {
    score -= 10;
    issues.push('No recent transactions recorded');
    recommendations.push('Ensure all recent transactions are properly recorded');
  }

  // Check expense categorization
  const uncategorizedExpenses = data.expenses.filter(expense => !expense.category);
  if (uncategorizedExpenses.length > 0) {
    score -= 5;
    issues.push('Some expenses are not properly categorized');
    recommendations.push('Categorize all expenses for proper tax treatment');
  }

  // Ensure score stays within 0-100 range
  score = Math.max(0, Math.min(100, score));

  return {
    score,
    issues,
    recommendations
  };
}; 