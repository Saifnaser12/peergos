export const calculateComplianceScore = (data) => {
    let score = 100;
    const totalRevenue = data.revenues.reduce((sum, entry) => sum + entry.amount, 0);
    // Check VAT registration compliance
    if (totalRevenue > 375000 && !data.profile.vatRegistered) {
        score -= 30;
    }
    // Check CIT registration compliance
    if (totalRevenue > 3000000 && !data.profile.citRegistered) {
        score -= 30;
    }
    // Check documentation completeness
    const hasCompleteDocumentation = data.revenues.every(r => r.source && r.date && r.amount) &&
        data.expenses.every(e => e.category && e.date && e.amount);
    if (!hasCompleteDocumentation) {
        score -= 20;
    }
    return Math.max(0, score);
};
