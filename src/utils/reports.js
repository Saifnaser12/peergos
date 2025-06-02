export const generatePDFReport = async (data) => {
    // This is a placeholder for PDF generation
    // In a real implementation, you would use a library like pdfmake or jspdf
    const reportContent = JSON.stringify(data, null, 2);
    return new Blob([reportContent], { type: 'application/pdf' });
};
export const generateExcelReport = async (data) => {
    // This is a placeholder for Excel generation
    // In a real implementation, you would use a library like xlsx
    const reportContent = JSON.stringify(data, null, 2);
    return new Blob([reportContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};
export const calculateDetailedComplianceScore = (data) => {
    const breakdown = [
        {
            category: 'VAT Compliance',
            score: 0,
            maxScore: 30,
            issues: []
        },
        {
            category: 'CIT Compliance',
            score: 0,
            maxScore: 30,
            issues: []
        },
        {
            category: 'Documentation',
            score: 0,
            maxScore: 20,
            issues: []
        },
        {
            category: 'Financial Records',
            score: 0,
            maxScore: 20,
            issues: []
        }
    ];
    // VAT Compliance Scoring
    if (data.profile.vatRegistered) {
        if (data.lastVATSubmission) {
            breakdown[0].score += 20;
        }
        else {
            breakdown[0].issues.push('Missing VAT submission');
        }
        if (data.vatReturnsUpToDate) {
            breakdown[0].score += 10;
        }
        else {
            breakdown[0].issues.push('VAT returns not up to date');
        }
    }
    else if (data.totalRevenue < 375000) {
        breakdown[0].score = 30; // Full score if VAT registration not required
    }
    // CIT Compliance Scoring
    if (data.isCITApplicable) {
        if (data.hasCITSubmission) {
            breakdown[1].score += 20;
        }
        else {
            breakdown[1].issues.push('Missing CIT submission');
        }
        if (data.citReturnsUpToDate) {
            breakdown[1].score += 10;
        }
        else {
            breakdown[1].issues.push('CIT returns not up to date');
        }
    }
    else {
        breakdown[1].score = 30; // Full score if CIT not applicable
    }
    // Documentation Scoring
    if (data.profile.licenseFile) {
        breakdown[2].score += 10;
    }
    else {
        breakdown[2].issues.push('Missing business license');
    }
    if (data.profile.taxRegistrationCert) {
        breakdown[2].score += 10;
    }
    else {
        breakdown[2].issues.push('Missing tax registration certificate');
    }
    // Financial Records Scoring
    if (data.expenses.length > 0) {
        breakdown[3].score += 10;
    }
    else {
        breakdown[3].issues.push('No expense records found');
    }
    if (data.revenues.length > 0) {
        breakdown[3].score += 10;
    }
    else {
        breakdown[3].issues.push('No revenue records found');
    }
    const totalScore = breakdown.reduce((sum, category) => sum + category.score, 0);
    const maxPossibleScore = breakdown.reduce((sum, category) => sum + category.maxScore, 0);
    return {
        score: Math.round((totalScore / maxPossibleScore) * 100),
        breakdown
    };
};
