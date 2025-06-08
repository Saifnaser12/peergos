import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const TaxAgentContext = createContext(undefined);
// Mock FTA-approved tax agents
export const mockTaxAgents = [
    {
        id: 'TA001',
        name: 'Ahmad Al-Rashid Tax Consultancy',
        certificateId: 'FTA-TC-2024-001',
        ftaProfileUrl: 'https://fta.gov.ae/agents/ahmad-al-rashid',
        specialization: ['VAT', 'CIT', 'Transfer Pricing'],
        rating: 4.9
    },
    {
        id: 'TA002',
        name: 'Emirates Tax Advisory Group',
        certificateId: 'FTA-TC-2024-002',
        ftaProfileUrl: 'https://fta.gov.ae/agents/emirates-tax-advisory',
        specialization: ['CIT', 'Excise Tax', 'Economic Substance'],
        rating: 4.8
    },
    {
        id: 'TA003',
        name: 'Dubai International Tax Services',
        certificateId: 'FTA-TC-2024-003',
        ftaProfileUrl: 'https://fta.gov.ae/agents/dubai-international-tax',
        specialization: ['VAT', 'CIT', 'Digital Taxation'],
        rating: 4.7
    },
    {
        id: 'TA004',
        name: 'Al-Mansouri & Associates',
        certificateId: 'FTA-TC-2024-004',
        ftaProfileUrl: 'https://fta.gov.ae/agents/al-mansouri-associates',
        specialization: ['Transfer Pricing', 'International Tax', 'CIT'],
        rating: 4.9
    },
    {
        id: 'TA005',
        name: 'Gulf Tax Experts LLC',
        certificateId: 'FTA-TC-2024-005',
        ftaProfileUrl: 'https://fta.gov.ae/agents/gulf-tax-experts',
        specialization: ['VAT', 'Customs', 'Trade Tax'],
        rating: 4.6
    },
    {
        id: 'TA006',
        name: 'Abu Dhabi Tax Consultants',
        certificateId: 'FTA-TC-2024-006',
        ftaProfileUrl: 'https://fta.gov.ae/agents/abu-dhabi-tax-consultants',
        specialization: ['CIT', 'VAT', 'Economic Substance'],
        rating: 4.8
    },
    {
        id: 'TA007',
        name: 'Sharjah Tax Advisory',
        certificateId: 'FTA-TC-2024-007',
        ftaProfileUrl: 'https://fta.gov.ae/agents/sharjah-tax-advisory',
        specialization: ['VAT', 'Small Business Tax', 'Compliance'],
        rating: 4.5
    },
    {
        id: 'TA008',
        name: 'Northern Emirates Tax Solutions',
        certificateId: 'FTA-TC-2024-008',
        ftaProfileUrl: 'https://fta.gov.ae/agents/northern-emirates-tax',
        specialization: ['CIT', 'VAT', 'Free Zone Tax'],
        rating: 4.7
    },
    {
        id: 'TA009',
        name: 'Professional Tax Alliance',
        certificateId: 'FTA-TC-2024-009',
        ftaProfileUrl: 'https://fta.gov.ae/agents/professional-tax-alliance',
        specialization: ['Transfer Pricing', 'CIT', 'Tax Planning'],
        rating: 4.9
    },
    {
        id: 'TA010',
        name: 'UAE Tax Compliance Center',
        certificateId: 'FTA-TC-2024-010',
        ftaProfileUrl: 'https://fta.gov.ae/agents/uae-tax-compliance',
        specialization: ['VAT', 'CIT', 'Tax Technology'],
        rating: 4.8
    }
];
export const TaxAgentProvider = ({ children }) => {
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [uploadedCertificate, setUploadedCertificate] = useState(null);
    const [certificateUrl, setCertificateUrl] = useState(null);
    const selectAgent = (agent) => {
        setSelectedAgent(agent);
    };
    const uploadCertificate = (file) => {
        setUploadedCertificate(file);
        // Create object URL for preview
        const url = URL.createObjectURL(file);
        setCertificateUrl(url);
    };
    const clearAgent = () => {
        setSelectedAgent(null);
        setUploadedCertificate(null);
        if (certificateUrl) {
            URL.revokeObjectURL(certificateUrl);
            setCertificateUrl(null);
        }
    };
    const value = {
        selectedAgent,
        uploadedCertificate,
        certificateUrl,
        selectAgent,
        uploadCertificate,
        clearAgent,
    };
    return (_jsx(TaxAgentContext.Provider, { value: value, children: children }));
};
export const useTaxAgent = () => {
    const context = useContext(TaxAgentContext);
    if (context === undefined) {
        throw new Error('useTaxAgent must be used within a TaxAgentProvider');
    }
    return context;
};
