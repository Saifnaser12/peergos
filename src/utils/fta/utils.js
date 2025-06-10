// Mock company database for TRN validation
export const mockCompanyDatabase = {
    '100346598400003': {
        trn: '100346598400003',
        companyName: 'Zahara Building Tech FZ LLC',
        status: 'Active',
        registrationDate: '2019-03-15',
        businessType: 'Construction Technology',
        emirate: 'Dubai'
    },
    '100123456700003': {
        trn: '100123456700003',
        companyName: 'Al Mansouri Trading LLC',
        status: 'Active',
        registrationDate: '2018-01-01',
        businessType: 'Trading',
        emirate: 'Dubai'
    },
    '100987654300001': {
        trn: '100987654300001',
        companyName: 'Emirates Tech Solutions FZE',
        status: 'Active',
        registrationDate: '2019-06-15',
        businessType: 'Technology Services',
        emirate: 'Abu Dhabi'
    },
    '100555666700002': {
        trn: '100555666700002',
        companyName: 'Gulf Construction Company LLC',
        status: 'Active',
        registrationDate: '2017-03-10',
        businessType: 'Construction',
        emirate: 'Sharjah'
    },
    '100111222300004': {
        trn: '100111222300004',
        companyName: 'Desert Rose Hospitality Group',
        status: 'Suspended',
        registrationDate: '2020-02-20',
        businessType: 'Hospitality',
        emirate: 'Dubai'
    }
};
export const validateTRN = async (trn) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const cleanTRN = trn.replace(/\D/g, '');
    if (cleanTRN.length !== 15) {
        throw new Error('Invalid TRN format. TRN must be 15 digits.');
    }
    return mockCompanyDatabase[cleanTRN] || null;
};
export const checkFTAIntegrationStatus = (trn) => {
    const hasCompanyData = !!mockCompanyDatabase[trn];
    const hasTaxAgent = localStorage.getItem(`tax_agent_cert_${trn}`) !== null;
    if (hasCompanyData && hasTaxAgent) {
        return {
            isIntegrated: true,
            status: 'Integrated'
        };
    }
    else {
        return {
            isIntegrated: false,
            status: 'Pending Setup',
            reason: !hasCompanyData ? 'Company not verified' : 'Tax agent certificate required'
        };
    }
};
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AE', {
        style: 'currency',
        currency: 'AED',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};
export const simulateFileUpload = async (file, type, trn) => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Validate file
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('File size exceeds 10MB limit');
    }
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only PDF, JPEG, and PNG are allowed.');
    }
    // Store file info in localStorage
    const uploadData = {
        fileName: file.name,
        uploadDate: new Date().toISOString(),
        size: file.size,
        type: file.type
    };
    localStorage.setItem(`${type}_cert_${trn}`, JSON.stringify(uploadData));
    return {
        success: true,
        fileName: file.name,
        uploadDate: uploadData.uploadDate
    };
};
