import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Paper, Typography, TextField, Button, Alert, CircularProgress, InputAdornment, IconButton, Container, Grid, useTheme, Stepper, Step, StepLabel } from '@mui/material';
import { BuildingOfficeIcon, EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon, ArrowRightIcon, DocumentTextIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
const Register = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const theme = useTheme();
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        password: '',
        confirmPassword: '',
        taxNumber: '',
        address: '',
        phone: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const steps = [
        t('register.steps.company', 'Company Information'),
        t('register.steps.contact', 'Contact Details'),
        t('register.steps.security', 'Security')
    ];
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        if (formData.password !== formData.confirmPassword) {
            setError(t('register.passwordMismatch', 'Passwords do not match'));
            setLoading(false);
            return;
        }
        try {
            // TODO: Replace with actual API call
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify({
                email: formData.email,
                companyName: formData.companyName,
                role: 'SME' // New registrations are always SMEs
            }));
            navigate('/dashboard');
        }
        catch (err) {
            setError(t('register.error', 'Registration failed. Please try again.'));
        }
        finally {
            setLoading(false);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };
    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (_jsxs(_Fragment, { children: [_jsx(TextField, { fullWidth: true, label: t('register.companyName', 'Company Name'), name: "companyName", value: formData.companyName, onChange: handleChange, required: true, autoComplete: "organization", sx: { mb: 2 }, InputProps: {
                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(BuildingOfficeIcon, { className: "h-5 w-5 text-gray-400" }) })),
                            } }), _jsx(TextField, { fullWidth: true, label: t('register.taxNumber', 'Tax Registration Number'), name: "taxNumber", value: formData.taxNumber, onChange: handleChange, required: true, sx: { mb: 2 }, InputProps: {
                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(DocumentTextIcon, { className: "h-5 w-5 text-gray-400" }) })),
                            } })] }));
            case 1:
                return (_jsxs(_Fragment, { children: [_jsx(TextField, { fullWidth: true, label: t('register.email', 'Email Address'), name: "email", type: "email", value: formData.email, onChange: handleChange, required: true, autoComplete: "email", sx: { mb: 2 }, InputProps: {
                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(EnvelopeIcon, { className: "h-5 w-5 text-gray-400" }) })),
                            } }), _jsx(TextField, { fullWidth: true, label: t('register.phone', 'Phone Number'), name: "phone", value: formData.phone, onChange: handleChange, required: true, type: "tel", sx: { mb: 2 }, InputProps: {
                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(PhoneIcon, { className: "h-5 w-5 text-gray-400" }) })),
                            } }), _jsx(TextField, { fullWidth: true, label: t('register.address', 'Company Address'), name: "address", value: formData.address, onChange: handleChange, required: true, multiline: true, rows: 2, sx: { mb: 2 }, InputProps: {
                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(MapPinIcon, { className: "h-5 w-5 text-gray-400" }) })),
                            } })] }));
            case 2:
                return (_jsxs(_Fragment, { children: [_jsx(TextField, { fullWidth: true, label: t('register.password', 'Password'), name: "password", type: showPassword ? 'text' : 'password', value: formData.password, onChange: handleChange, required: true, autoComplete: "new-password", sx: { mb: 2 }, InputProps: {
                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(LockClosedIcon, { className: "h-5 w-5 text-gray-400" }) })),
                                endAdornment: (_jsx(InputAdornment, { position: "end", children: _jsx(IconButton, { onClick: () => setShowPassword(!showPassword), edge: "end", children: showPassword ? (_jsx(EyeSlashIcon, { className: "h-5 w-5" })) : (_jsx(EyeIcon, { className: "h-5 w-5" })) }) })),
                            } }), _jsx(TextField, { fullWidth: true, label: t('register.confirmPassword', 'Confirm Password'), name: "confirmPassword", type: showPassword ? 'text' : 'password', value: formData.confirmPassword, onChange: handleChange, required: true, autoComplete: "new-password", sx: { mb: 2 }, InputProps: {
                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(LockClosedIcon, { className: "h-5 w-5 text-gray-400" }) })),
                            } })] }));
            default:
                return null;
        }
    };
    return (_jsx(Box, { sx: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            py: 4
        }, children: _jsx(Container, { maxWidth: "lg", children: _jsxs(Grid, { container: true, spacing: 4, alignItems: "center", children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Box, { sx: { color: 'white', textAlign: { xs: 'center', md: 'left' } }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2, mb: 4, justifyContent: { xs: 'center', md: 'flex-start' } }, children: [_jsx(BuildingOfficeIcon, { className: "h-12 w-12" }), _jsx(Typography, { variant: "h4", sx: { fontWeight: 700 }, children: "TaxPro" })] }), _jsx(Typography, { variant: "h3", sx: { fontWeight: 700, mb: 2 }, children: t('register.welcome', 'Join the Future of Tax Management') }), _jsx(Typography, { variant: "h6", sx: { opacity: 0.9, mb: 4 }, children: t('register.subtitle', 'Create your account and start managing your tax compliance efficiently') }), _jsxs(Box, { sx: { display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(Box, { sx: { width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' } }), _jsx(Typography, { children: "Easy Registration" })] }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(Box, { sx: { width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' } }), _jsx(Typography, { children: "Secure Platform" })] }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(Box, { sx: { width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' } }), _jsx(Typography, { children: "24/7 Support" })] })] })] }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Paper, { elevation: 0, sx: {
                                p: 4,
                                borderRadius: 4,
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                            }, children: [_jsx(Typography, { variant: "h5", sx: { fontWeight: 600, mb: 3, textAlign: 'center' }, children: t('register.title', 'Create your account') }), _jsx(Stepper, { activeStep: activeStep, sx: { mb: 4 }, children: steps.map((label) => (_jsx(Step, { children: _jsx(StepLabel, { children: label }) }, label))) }), error && (_jsx(Alert, { severity: "error", sx: { mb: 3 }, children: error })), _jsxs("form", { onSubmit: handleSubmit, children: [renderStepContent(activeStep), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mt: 3 }, children: [_jsx(Button, { disabled: activeStep === 0, onClick: handleBack, sx: {
                                                        textTransform: 'none',
                                                        color: 'text.secondary'
                                                    }, children: t('register.back', 'Back') }), activeStep === steps.length - 1 ? (_jsx(Button, { type: "submit", variant: "contained", disabled: loading, size: "large", sx: {
                                                        py: 1.5,
                                                        px: 4,
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        fontSize: '1rem',
                                                        fontWeight: 600,
                                                        boxShadow: 'none',
                                                        '&:hover': {
                                                            boxShadow: 'none',
                                                            backgroundColor: 'primary.dark'
                                                        }
                                                    }, children: loading ? (_jsx(CircularProgress, { size: 24, color: "inherit" })) : (_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [t('register.createAccount', 'Create Account'), _jsx(ArrowRightIcon, { className: "h-5 w-5" })] })) })) : (_jsx(Button, { variant: "contained", onClick: handleNext, size: "large", sx: {
                                                        py: 1.5,
                                                        px: 4,
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        fontSize: '1rem',
                                                        fontWeight: 600,
                                                        boxShadow: 'none',
                                                        '&:hover': {
                                                            boxShadow: 'none',
                                                            backgroundColor: 'primary.dark'
                                                        }
                                                    }, children: t('register.next', 'Next') }))] })] }), _jsxs(Box, { sx: { mt: 4, textAlign: 'center' }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 1 }, children: t('register.alreadyHaveAccount', 'Already have an account?') }), _jsx(Button, { variant: "outlined", onClick: () => navigate('/login'), sx: {
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                borderColor: 'primary.main',
                                                color: 'primary.main',
                                                '&:hover': {
                                                    borderColor: 'primary.dark',
                                                    backgroundColor: 'primary.50'
                                                }
                                            }, children: t('register.signIn', 'Sign in') })] })] }) })] }) }) }));
};
export default Register;
