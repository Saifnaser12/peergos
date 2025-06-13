import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Container, Paper, Typography, Tabs, Tab, Box, Button, Grid, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Alert, LinearProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CloudUploadIcon, CheckCircleIcon, DocumentTextIcon, UserGroupIcon, BuildingOfficeIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (_jsx("div", { role: "tabpanel", hidden: value !== index, id: `substance-tabpanel-${index}`, "aria-labelledby": `substance-tab-${index}`, ...other, children: value === index && (_jsx(Box, { sx: { p: 3 }, children: children })) }));
}
export const FreeZoneSubstance = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(0);
    const [uploads, setUploads] = useState({
        officeLease: { file: null, uploaded: false },
        salaryPayrolls: { file: null, uploaded: false },
        staffCounts: { file: null, uploaded: false },
        auditedFinancials: { file: null, uploaded: false },
        transferPricingDeclaration: { file: null, uploaded: false },
        transferPricingDocs: { file: null, uploaded: false }
    });
    const [checklist, setChecklist] = useState({
        physicalOffice: false,
        adequateStaff: false,
        coreActivities: false,
        auditedFinancials: false,
        transferPricingCompliance: false
    });
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };
    const handleFileUpload = (key, file) => {
        setUploads(prev => ({
            ...prev,
            [key]: {
                file,
                uploaded: true,
                uploadDate: new Date().toISOString()
            }
        }));
    };
    const handleChecklistChange = (key, checked) => {
        setChecklist(prev => ({
            ...prev,
            [key]: checked
        }));
    };
    const calculateCompliancePercentage = () => {
        const totalItems = Object.keys(uploads).length + Object.keys(checklist).length;
        const completedUploads = Object.values(uploads).filter(item => item.uploaded).length;
        const completedChecklist = Object.values(checklist).filter(Boolean).length;
        return Math.round(((completedUploads + completedChecklist) / totalItems) * 100);
    };
    const compliancePercentage = calculateCompliancePercentage();
    const FileUploadCard = ({ title, description, uploadKey, icon: Icon }) => (_jsx(Card, { sx: { mb: 2 }, children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 2 }, children: [_jsx(Icon, { className: "w-6 h-6 mr-2 text-indigo-600" }), _jsx(Typography, { variant: "h6", children: title }), uploads[uploadKey].uploaded && (_jsx(CheckCircleIcon, { className: "w-5 h-5 ml-auto text-green-600" }))] }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 2 }, children: description }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2 }, children: [_jsx("input", { accept: ".pdf,.doc,.docx,.xlsx,.xls", style: { display: 'none' }, id: `upload-${uploadKey}`, type: "file", onChange: (e) => {
                                const file = e.target.files?.[0];
                                if (file)
                                    handleFileUpload(uploadKey, file);
                            } }), _jsx("label", { htmlFor: `upload-${uploadKey}`, children: _jsx(Button, { variant: "outlined", component: "span", startIcon: _jsx(CloudUploadIcon, { className: "w-4 h-4" }), size: "small", children: uploads[uploadKey].uploaded ? t('freeZone.substance.reupload', 'Re-upload') : t('freeZone.substance.upload', 'Upload') }) }), uploads[uploadKey].uploaded && (_jsxs(Typography, { variant: "caption", color: "text.secondary", children: [t('freeZone.substance.uploadedOn', 'Uploaded on'), ": ", new Date(uploads[uploadKey].uploadDate).toLocaleDateString()] }))] }), uploads[uploadKey].file && (_jsx(Typography, { variant: "caption", color: "text.secondary", sx: { mt: 1, display: 'block' }, children: uploads[uploadKey].file.name }))] }) }));
    const ChecklistItem = ({ title, description, checkKey }) => (_jsxs(ListItem, { children: [_jsx(ListItemIcon, { children: _jsx("input", { type: "checkbox", checked: checklist[checkKey], onChange: (e) => handleChecklistChange(checkKey, e.target.checked), className: "w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" }) }), _jsx(ListItemText, { primary: title, secondary: description })] }));
    return (_jsxs(Container, { maxWidth: "lg", sx: { py: 4 }, children: [_jsxs(Paper, { sx: { p: 3, mb: 3 }, children: [_jsx(Typography, { variant: "h4", gutterBottom: true, children: t('freeZone.substance.title', 'Free Zone Economic Substance') }), _jsx(Typography, { variant: "body1", color: "text.secondary", paragraph: true, children: t('freeZone.substance.description', 'Manage your Free Zone economic substance requirements and documentation to maintain QFZP status and compliance with UAE regulations.') }), _jsxs(Box, { sx: { mb: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 1 }, children: [_jsx(Typography, { variant: "subtitle2", children: t('freeZone.substance.complianceProgress', 'Compliance Progress') }), _jsxs(Typography, { variant: "subtitle2", color: compliancePercentage >= 80 ? 'success.main' : compliancePercentage >= 50 ? 'warning.main' : 'error.main', children: [compliancePercentage, "%"] })] }), _jsx(LinearProgress, { variant: "determinate", value: compliancePercentage, sx: {
                                    height: 8,
                                    borderRadius: 4,
                                    bgcolor: 'grey.200',
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: compliancePercentage >= 80 ? 'success.main' : compliancePercentage >= 50 ? 'warning.main' : 'error.main'
                                    }
                                } })] }), compliancePercentage < 100 && (_jsx(Alert, { severity: "info", sx: { mb: 3 }, children: t('freeZone.substance.incompleteWarning', 'Please complete all substance requirements to maintain your QFZP status and avoid penalties.') }))] }), _jsxs(Paper, { sx: { p: 0 }, children: [_jsxs(Tabs, { value: activeTab, onChange: handleTabChange, "aria-label": "substance requirements tabs", children: [_jsx(Tab, { label: t('freeZone.substance.tabs.documentation', 'Documentation') }), _jsx(Tab, { label: t('freeZone.substance.tabs.checklist', 'Compliance Checklist') }), _jsx(Tab, { label: t('freeZone.substance.tabs.transferPricing', 'Transfer Pricing') })] }), _jsxs(TabPanel, { value: activeTab, index: 0, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: t('freeZone.substance.documentation.title', 'Required Documentation') }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 3 }, children: t('freeZone.substance.documentation.subtitle', 'Upload the following documents to demonstrate economic substance in your Free Zone operations.') }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsxs(Grid, { item: true, xs: 12, md: 6, children: [_jsx(FileUploadCard, { title: t('freeZone.substance.officeLease.title', 'Office Lease Agreement'), description: t('freeZone.substance.officeLease.description', 'Valid lease agreement demonstrating physical office presence in the Free Zone'), uploadKey: "officeLease", icon: BuildingOfficeIcon }), _jsx(FileUploadCard, { title: t('freeZone.substance.salaryPayrolls.title', 'Salary & Payroll Records'), description: t('freeZone.substance.salaryPayrolls.description', 'Monthly payroll records showing adequate qualified staff'), uploadKey: "salaryPayrolls", icon: CurrencyDollarIcon })] }), _jsxs(Grid, { item: true, xs: 12, md: 6, children: [_jsx(FileUploadCard, { title: t('freeZone.substance.staffCounts.title', 'Staff Count Records'), description: t('freeZone.substance.staffCounts.description', 'Detailed staff records including qualifications and roles'), uploadKey: "staffCounts", icon: UserGroupIcon }), _jsx(FileUploadCard, { title: t('freeZone.substance.auditedFinancials.title', 'Audited Financial Statements'), description: t('freeZone.substance.auditedFinancials.description', 'Latest audited financial statements as required by regulations'), uploadKey: "auditedFinancials", icon: DocumentTextIcon })] })] })] }), _jsxs(TabPanel, { value: activeTab, index: 1, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: t('freeZone.substance.checklist.title', 'Economic Substance Checklist') }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 3 }, children: t('freeZone.substance.checklist.subtitle', 'Confirm that your Free Zone entity meets all economic substance requirements.') }), _jsxs(List, { children: [_jsx(ChecklistItem, { title: t('freeZone.substance.checklist.physicalOffice', 'Physical Office Presence'), description: t('freeZone.substance.checklist.physicalOfficeDesc', 'Maintained adequate physical office space in the Free Zone'), checkKey: "physicalOffice" }), _jsx(ChecklistItem, { title: t('freeZone.substance.checklist.adequateStaff', 'Adequate Qualified Staff'), description: t('freeZone.substance.checklist.adequateStaffDesc', 'Employed sufficient number of qualified staff to conduct core activities'), checkKey: "adequateStaff" }), _jsx(ChecklistItem, { title: t('freeZone.substance.checklist.coreActivities', 'Core Income Generating Activities'), description: t('freeZone.substance.checklist.coreActivitiesDesc', 'Conducted core income generating activities in the UAE'), checkKey: "coreActivities" }), _jsx(ChecklistItem, { title: t('freeZone.substance.checklist.auditedFinancials', 'Audited Financial Statements'), description: t('freeZone.substance.checklist.auditedFinancialsDesc', 'Prepared audited financial statements in accordance with international standards'), checkKey: "auditedFinancials" }), _jsx(ChecklistItem, { title: t('freeZone.substance.checklist.transferPricingCompliance', 'Transfer Pricing Compliance'), description: t('freeZone.substance.checklist.transferPricingComplianceDesc', 'Maintained proper transfer pricing documentation for related party transactions'), checkKey: "transferPricingCompliance" })] })] }), _jsxs(TabPanel, { value: activeTab, index: 2, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: t('freeZone.substance.transferPricing.title', 'Transfer Pricing Documentation') }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 3 }, children: t('freeZone.substance.transferPricing.subtitle', 'Upload transfer pricing documentation and declarations as required for Free Zone entities.') }), _jsx(Grid, { container: true, spacing: 3, children: _jsxs(Grid, { item: true, xs: 12, children: [_jsx(FileUploadCard, { title: t('freeZone.substance.transferPricingDeclaration.title', 'Transfer Pricing Declaration'), description: t('freeZone.substance.transferPricingDeclaration.description', 'Completed transfer pricing declaration form for related party transactions'), uploadKey: "transferPricingDeclaration", icon: DocumentTextIcon }), _jsx(FileUploadCard, { title: t('freeZone.substance.transferPricingDocs.title', 'Transfer Pricing Documentation'), description: t('freeZone.substance.transferPricingDocs.description', 'Supporting documentation including local file, master file, and economic analysis'), uploadKey: "transferPricingDocs", icon: DocumentTextIcon })] }) }), _jsxs(Alert, { severity: "warning", sx: { mt: 3 }, children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: t('freeZone.substance.transferPricing.warning', 'Important Notice') }), _jsx(Typography, { variant: "body2", children: t('freeZone.substance.transferPricing.warningText', 'Ensure all transfer pricing documentation complies with UAE guidelines and demonstrates arm\'s length pricing for transactions with related parties.') })] })] })] })] }));
};
export default FreeZoneSubstance;
