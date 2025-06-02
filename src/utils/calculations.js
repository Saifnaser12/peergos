export const calculateTaxLiability = (revenue) => {
    // VAT calculation (5%)
    const vatAmount = revenue * 0.05;
    // CIT calculation (9% over AED 375,000)
    let citAmount = 0;
    if (revenue > 375000) {
        citAmount = (revenue - 375000) * 0.09;
    }
    return vatAmount + citAmount;
};
