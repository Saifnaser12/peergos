import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserRole } from '../context/UserRoleContext';
import { Box, Paper, Typography, TextField, Button, Alert, CircularProgress, Link, InputAdornment, IconButton, Container, Grid, useTheme } from '@mui/material';
import { BuildingOfficeIcon, EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { setRole } = useUserRole();
    const theme = useTheme();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        companyName: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // TODO: Replace with actual API call
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            // For demo purposes, set role based on company name
            const role = formData.companyName.toLowerCase().includes('admin') ? 'Admin' : 'SME';
            setRole(role);
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify({
                email: formData.email,
                companyName: formData.companyName,
                role
            }));
            navigate('/dashboard');
        }
        catch (err) {
            setError(t('login.error', 'Invalid credentials. Please try again.'));
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
    return (_jsx(Box, { sx: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            py: 4
        }, children: _jsx(Container, { maxWidth: "lg", children: _jsxs(Grid, { container: true, spacing: 4, alignItems: "center", children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Box, { sx: { color: 'white', textAlign: { xs: 'center', md: 'left' } }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2, mb: 4, justifyContent: { xs: 'center', md: 'flex-start' } }, children: [_jsx(BuildingOfficeIcon, { className: "h-12 w-12" }), _jsx(Typography, { variant: "h4", sx: { fontWeight: 700 }, children: "TaxPro" })] }), _jsx(Typography, { variant: "h3", sx: { fontWeight: 700, mb: 2 }, children: t('login.welcome', 'Welcome to the Future of Tax Management') }), _jsx(Typography, { variant: "h6", sx: { opacity: 0.9, mb: 4 }, children: t('login.subtitle', 'Streamline your tax compliance with our intelligent platform') }), _jsxs(Box, { sx: { display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(Box, { sx: { width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' } }), _jsx(Typography, { children: "Real-time Compliance" })] }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(Box, { sx: { width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' } }), _jsx(Typography, { children: "Automated Reporting" })] }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(Box, { sx: { width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' } }), _jsx(Typography, { children: "Smart Analytics" })] })] })] }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Paper, { elevation: 0, sx: {
                                p: 4,
                                borderRadius: 4,
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                            }, children: [_jsx(Typography, { variant: "h5", sx: { fontWeight: 600, mb: 3, textAlign: 'center' }, children: t('login.title', 'Sign in to your account') }), error && (_jsx(Alert, { severity: "error", sx: { mb: 3 }, children: error })), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(TextField, { fullWidth: true, label: t('login.companyName', 'Company Name'), name: "companyName", value: formData.companyName, onChange: handleChange, required: true, autoComplete: "organization", sx: { mb: 2 }, InputProps: {
                                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(BuildingOfficeIcon, { className: "h-5 w-5 text-gray-400" }) })),
                                            } }), _jsx(TextField, { fullWidth: true, label: t('login.email', 'Email Address'), name: "email", type: "email", value: formData.email, onChange: handleChange, required: true, autoComplete: "email", sx: { mb: 2 }, InputProps: {
                                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(EnvelopeIcon, { className: "h-5 w-5 text-gray-400" }) })),
                                            } }), _jsx(TextField, { fullWidth: true, label: t('login.password', 'Password'), name: "password", type: showPassword ? 'text' : 'password', value: formData.password, onChange: handleChange, required: true, autoComplete: "current-password", sx: { mb: 3 }, InputProps: {
                                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(LockClosedIcon, { className: "h-5 w-5 text-gray-400" }) })),
                                                endAdornment: (_jsx(InputAdornment, { position: "end", children: _jsx(IconButton, { onClick: () => setShowPassword(!showPassword), edge: "end", children: showPassword ? (_jsx(EyeSlashIcon, { className: "h-5 w-5" })) : (_jsx(EyeIcon, { className: "h-5 w-5" })) }) })),
                                            } }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx("input", { id: "remember-me", name: "remember-me", type: "checkbox", className: "h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" }), _jsx("label", { htmlFor: "remember-me", className: "ml-2 block text-sm text-gray-900", children: t('login.rememberMe', 'Remember me') })] }), _jsx(Link, { href: "#", sx: {
                                                        color: 'primary.main',
                                                        textDecoration: 'none',
                                                        '&:hover': { textDecoration: 'underline' }
                                                    }, children: t('login.forgotPassword', 'Forgot your password?') })] }), _jsx(Button, { type: "submit", fullWidth: true, variant: "contained", disabled: loading, size: "large", sx: {
                                                py: 1.5,
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                boxShadow: 'none',
                                                '&:hover': {
                                                    boxShadow: 'none',
                                                    backgroundColor: 'primary.dark'
                                                }
                                            }, children: loading ? (_jsx(CircularProgress, { size: 24, color: "inherit" })) : (_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [t('login.signIn', 'Sign in'), _jsx(ArrowRightIcon, { className: "h-5 w-5" })] })) }), _jsxs(Box, { sx: { mt: 4, textAlign: 'center' }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 1 }, children: t('login.noAccount', "Don't have an account?") }), _jsx(Button, { variant: "outlined", onClick: () => navigate('/register'), sx: {
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        borderColor: 'primary.main',
                                                        color: 'primary.main',
                                                        '&:hover': {
                                                            borderColor: 'primary.dark',
                                                            backgroundColor: 'primary.50'
                                                        }
                                                    }, children: t('login.createAccount', 'Create a new account') })] })] })] }) })] }) }) }));
};
export default Login;
