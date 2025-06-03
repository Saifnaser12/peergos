import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Paper, Grid } from '@mui/material';
export const GridTest = () => {
    return (_jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(Paper, { children: "Test Item 1" }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(Paper, { children: "Test Item 2" }) })] }));
};
