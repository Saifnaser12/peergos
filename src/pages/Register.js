import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography, Paper, TextField, Button } from '@mui/material';
const Register = () => {
    return (_jsx(Box, { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", children: _jsxs(Paper, { sx: { p: 4, maxWidth: 400, width: '100%' }, children: [_jsx(Typography, { variant: "h4", gutterBottom: true, align: "center", children: "Register" }), _jsx(TextField, { fullWidth: true, label: "Full Name", margin: "normal", variant: "outlined" }), _jsx(TextField, { fullWidth: true, label: "Email", margin: "normal", variant: "outlined" }), _jsx(TextField, { fullWidth: true, label: "Password", type: "password", margin: "normal", variant: "outlined" }), _jsx(Button, { fullWidth: true, variant: "contained", sx: { mt: 2 }, children: "Register" })] }) }));
};
export default Register;
