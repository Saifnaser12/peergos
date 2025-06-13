import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useI18nHelpers from '../hooks/useI18nHelpers';
import { useUserRole } from '../context/UserRoleContext';
import { Box, Typography, Paper } from '@mui/material';
const Filing = () => {
    const { t } = useI18nHelpers();
    const { hasPermission } = useUserRole();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissions, setSubmissions] = useState([]);
    // Check setup completion
    const [isSetupComplete, setIsSetupComplete] = useState(false);
    useEffect(() => {
        const setupStatus = localStorage.getItem('peergos_setup_complete');
        setIsSetupComplete(setupStatus === 'true');
    }, []);
    const handleSubmit = async (formData) => {
        if (!hasPermission('filing', 'submit')) {
            alert('You do not have permission to submit filings');
            return;
        }
        // Block submission if setup is incomplete
        if (!isSetupComplete) {
            if (confirm('Setup is incomplete. Complete setup first to ensure compliance. Navigate to Setup page?')) {
                navigate('/setup');
            }
            return;
        }
        setIsSubmitting(true);
        try {
            // Simulate submission
            console.log('Submitting filing:', formData);
            // Add to submissions list
            setSubmissions(prev => [...prev, {
                    id: Date.now(),
                    type: formData.type,
                    date: new Date().toISOString(),
                    status: 'submitted'
                }]);
        }
        catch (error) {
            console.error('Filing submission error:', error);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs(Box, { children: [_jsx(Typography, { variant: "h4", gutterBottom: true, children: t('nav.filing') }), _jsxs(Paper, { elevation: 0, className: "p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6 relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 opacity-8 bg-cover bg-center", style: { backgroundImage: 'url(/images/peergos_slide_14.png)' } }), _jsx(Box, { className: "relative z-10", children: _jsx(Typography, { variant: "h6", className: "text-gray-900 dark:text-white font-semibold mb-4", children: t('filing.checklist.title', 'Pre-Filing Checklist') }) })] })] }));
};
export default Filing;
